
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

   return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart,
   });
};

export const incrementCartItemQuantity = async (req, res) => {
   const { productId, variantId } = req.params;

   // Look up the product; only filter by variant when variantId is present
   const product = await productModel.findOne(
      variantId
         ? { _id: productId, "variants._id": variantId }
         : { _id: productId },
   );

   if (!product) {
      return res.status(404).json({
         message: "Product not found",
         success: false,
      });
   }

   // Bug fix: was using productModel instead of cartModel
   const cart = await cartModel.findOne({ user: req.user._id });

   if (!cart) {
      return res.status(404).json({
         message: "Cart not found",
         success: false,
      });
   }

   // For base products use product.stock directly; stockOfVariant needs a variantId
   const stock = variantId
      ? await stockOfVariant(productId, variantId)
      : product.stock;

   const itemQuantityInCart =
      cart.items.find(
         (item) =>
            item.product.toString() === productId &&
            // Safe check: base product items have no variant field
            (variantId
               ? item.variant?.toString() === variantId
               : !item.variant),
      )?.quantity || 0;

   if (itemQuantityInCart + 1 > stock) {
      return res.status(400).json({
         message: `Only ${stock} items left in stock. And you already have ${itemQuantityInCart} items in your cart`,
         success: false,
      });
   }

   // Use arrayFilters to safely target the correct item for both base and variant products
   await cartModel.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { "items.$[elem].quantity": 1 } },
      {
         arrayFilters: variantId
            ? [{ "elem.product": productId, "elem.variant": variantId }]
            : [{ "elem.product": productId, "elem.variant": { $exists: false } }],
         new: true,
      },
   );

   return res.status(200).json({
      message: "Cart item quantity incremented successfully",
      success: true,
   });
};
