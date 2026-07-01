import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res) => {
   const { productId, variantId } = req.params;
   const { quantity = 1 } = req.body;

   const product = await productModel.findOne(
      variantId
         ? { _id: productId, "variants._id": variantId }
         : { _id: productId },
   );

   if (!product) {
      return res.status(404).json({
         message: "Product or variant not found",
         success: false,
      });
   }

   const stock = variantId
      ? await stockOfVariant(productId, variantId)
      : product.stock; // adjust to your field name

   const cart =
      (await cartModel.findOne({ user: req.user._id })) ||
      (await cartModel.create({ user: req.user._id }));

   const existingItem = cart.items.find(
      (item) =>
         item.product.toString() === productId &&
         (variantId ? item.variant?.toString() === variantId : !item.variant),
   );

   if (existingItem) {
      if (existingItem.quantity + quantity > stock) {
         return res.status(400).json({
            message: `Only ${stock - existingItem.quantity} items left in stock, you already have ${existingItem.quantity} in your cart`,
            success: false,
         });
      }

      // Use arrayFilters + $[elem] — works for both variant and base-product items
      // (the positional $ operator requires the filter condition to be in the query,
      //  which is unreliable when the variant field may be absent)
      await cartModel.findOneAndUpdate(
         { user: req.user._id },
         { $inc: { "items.$[elem].quantity": quantity } },
         {
            arrayFilters: variantId
               ? [{ "elem.product": productId, "elem.variant": variantId }]
               : [
                    {
                       "elem.product": productId,
                       "elem.variant": { $exists: false },
                    },
                 ],
            new: true,
         },
      );

      return res.status(200).json({
         message: "Cart updated successfully",
         success: true,
      });
   }

   if (quantity > stock) {
      return res.status(400).json({
         message: `Only ${stock} items left in stock`,
         success: true,
      });
   }

   // 5. Price — from variant if exists, else base product price
   const price = variantId
      ? (product.variants.id(variantId)?.price ?? product.price)
      : product.price;

   cart.items.push({
      product: productId,
      ...(variantId && { variant: variantId }),
      quantity,
      price,
      originalPrice: price,
   });

   await cart.save();

   return res.status(200).json({
      message: "Product added to cart successfully",
      success: true,
   });
};

export const getCart = async (req, res) => {
   const user = req.user;

   let cart = await cartModel
      .findOne({ user: user._id })
      .populate("items.product");

   if (!cart) {
      cart = await cartModel.create({ user: user._id });
   }

   // Convert to plain object so we can safely override fields for the response
   const cartObj = cart.toObject();

   cartObj.items = cartObj.items.map((item) => {
      const product = item.product;
      if (!product) return item; // deleted/missing product — leave as-is

      const livePrice = item.variant
         ? product.variants?.find(
              (v) => v._id.toString() === item.variant.toString(),
           )?.price
         : product.price;

      return {
         ...item,
         price: livePrice ?? item.price, // fall back to stored price if variant/product price missing
         // originalPrice stays untouched — the frozen snapshot from addToCart
      };
   });

   return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart: cartObj,
   });
};

export const incrementCartItemQuantity = async (req, res) => {
   const session = await mongoose.startSession();

   try {
      const { productId, variantId } = req.params;
      const pid = new mongoose.Types.ObjectId(productId);
      const vid = variantId ? new mongoose.Types.ObjectId(variantId) : null;

      await session.withTransaction(async () => {
         // Product lookup is genuinely needed here for stock on base products
         const product = await productModel.findOne(
            vid ? { _id: pid, "variants._id": vid } : { _id: pid },
            null,
            { session },
         );

         if (!product) {
            return res.status(404).json({
               message: "Product not found",
               success: false,
            });
         }

         const cart = await cartModel.findOne({ user: req.user._id }, null, {
            session,
         });

         if (!cart) {
            return res.status(404).json({
               message: "Cart not found",
               success: false,
            });
         }

         // Explicit item existence check — don't fall back to 0
         const cartItem = cart.items.find(
            (item) =>
               item.product.equals(pid) &&
               (vid ? item.variant?.equals(vid) : !item.variant),
         );

         if (!cartItem) {
            return res.status(404).json({
               message: "Item not found in cart",
               success: false,
            });
         }

         // Stock resolved inside the transaction to avoid stale reads
         const stock = vid
            ? await stockOfVariant(productId, variantId, session)
            : product.stock;

         if (cartItem.quantity + 1 > stock) {
            return res.status(400).json({
               message: `Only ${stock} item(s) in stock. You already have ${cartItem.quantity} in your cart`,
               success: false,
            });
         }

         const updated = await cartModel.findOneAndUpdate(
            {
               user: req.user._id,
               items: {
                  $elemMatch: vid
                     ? { product: pid, variant: vid }
                     : { product: pid, variant: { $exists: false } },
               },
            },
            { $inc: { "items.$[elem].quantity": 1 } },
            {
               arrayFilters: vid
                  ? [{ "elem.product": pid, "elem.variant": vid }]
                  : [
                       {
                          "elem.product": pid,
                          "elem.variant": { $exists: false },
                       },
                    ],
               new: true,
               session,
            },
         );

         if (!updated) {
            return res.status(404).json({
               message: "Item not found in cart",
               success: false,
            });
         }

         return res.status(200).json({
            message: "Cart item quantity incremented successfully",
            success: true,
         });
      });
   } catch (error) {
      return res.status(500).json({
         message: "Internal server error",
         success: false,
      });
   } finally {
      session.endSession();
   }
};

export const decrementCartItemQuantity = async (req, res) => {
   try {
      const { productId, variantId } = req.params;
      const pid = new mongoose.Types.ObjectId(productId);
      const vid = variantId ? new mongoose.Types.ObjectId(variantId) : null;

      // First confirm the item exists in the cart at all
      const cart = await cartModel.findOne({
         user: req.user._id,
         "items.product": pid,
         ...(vid ? { "items.variant": vid } : {}),
      });

      if (!cart) {
         return res.status(404).json({
            message: "Item not found in cart",
            success: false,
         });
      }

      const cartItem = cart.items.find(
         (item) =>
            item.product.equals(pid) &&
            (vid ? item.variant?.equals(vid) : !item.variant),
      );

      if (!cartItem) {
         return res.status(404).json({
            message: "Item not found in cart",
            success: false,
         });
      }

      // Guard minimum quantity check before touching the DB
      if (cartItem.quantity <= 1) {
         return res.status(400).json({
            message: "Cart item quantity cannot go below 1",
            success: false,
         });
      }

      // Atomic decrement — quantity > 1 guard baked into the filter
      const updated = await cartModel.findOneAndUpdate(
         {
            user: req.user._id,
            items: {
               $elemMatch: vid
                  ? { product: pid, variant: vid, quantity: { $gt: 1 } }
                  : {
                       product: pid,
                       variant: { $exists: false },
                       quantity: { $gt: 1 },
                    },
            },
         },
         { $inc: { "items.$[elem].quantity": -1 } },
         {
            arrayFilters: vid
               ? [{ "elem.product": pid, "elem.variant": vid }]
               : [{ "elem.product": pid, "elem.variant": { $exists: false } }],
            new: true,
         },
      );

      if (!updated) {
         return res.status(400).json({
            message: "Cart item quantity cannot go below 1",
            success: false,
         });
      }

      return res.status(200).json({
         message: "Cart item decremented successfully",
         success: true,
      });
   } catch (error) {
      return res.status(500).json({
         message: "Internal server error",
         success: false,
      });
   }
};

export const removeCartItem = async (req, res) => {
   try {
      const { productId, variantId } = req.params;

      const cart = await cartModel.findOne({ user: req.user._id });
      if (!cart) {
         return res
            .status(404)
            .json({ message: "Cart not found", success: false });
      }

      // Check item exists with correct variant match
      const cartItem = cart.items.find(
         (item) =>
            item.product.toString() === productId &&
            (variantId
               ? item.variant?.toString() === variantId
               : !item.variant),
      );

      if (!cartItem) {
         return res
            .status(404)
            .json({ message: "Item not found in cart", success: false });
      }

      // ✅ Build pull filter — must include variant to avoid removing wrong variants
      const pullFilter = { product: new mongoose.Types.ObjectId(productId) };

      if (variantId) {
         pullFilter.variant = new mongoose.Types.ObjectId(variantId);
      } else {
         // Only remove item that has no variant
         pullFilter.variant = { $exists: false };
      }

      const updatedCart = await cartModel
         .findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: pullFilter } },
            { new: true },
         )
         .populate("items.product"); // optional but useful

      return res.status(200).json({
         message: "Item removed from cart successfully",
         success: true,
         cart: updatedCart,
      });
   } catch (error) {
      console.error("removeCartItem error:", error);
      return res
         .status(500)
         .json({ message: "Internal server error", success: false });
   }
};
