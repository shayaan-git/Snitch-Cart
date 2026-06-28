import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
   validateAddToCart,
   validateCartItemQuantity,
} from "../validator/cart.validator.js";
import {
   addToCart,
   decrementCartItemQuantity,
   getCart,
   incrementCartItemQuantity,
   removeCartItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to Cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */

router.post(
   "/add/:productId/:variantId",
   authenticateUser,
   validateAddToCart,
   addToCart,
);

// Without variant (base product)
router.post("/add/:productId", authenticateUser, validateAddToCart, addToCart);

/**
 * @route GET /api/cart
 * @desc Get User's cart
 * @access Private
 */
router.get("/", authenticateUser, getCart);

/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @desc Increment item quantity in cart by one
 * @access Private
 * @argument productId - ID of the product to update
 * @argument variantId - ID of the variant to update
 */

router.patch(
   "/quantity/increment/:productId/:variantId",
   authenticateUser,
   validateCartItemQuantity,
   incrementCartItemQuantity,
);

// Without variant (base product)
router.patch(
   "/quantity/increment/:productId",
   authenticateUser,
   validateCartItemQuantity,
   incrementCartItemQuantity,
);

/**
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @desc decrement item quantity in cart by one
 * @access Private
 * @argument productId - ID of the product to update
 * @argument variantId - ID of the variant to update
 */

router.patch(
   "/quantity/decrement/:productId/:variantId",
   authenticateUser,
   validateCartItemQuantity,
   decrementCartItemQuantity,
);

// Without variant (base product)
router.patch(
   "/quantity/decrement/:productId",
   authenticateUser,
   validateCartItemQuantity,
   decrementCartItemQuantity,
);

/**
 * @route DELETE /api/cart/item/delete/:productId/:variantId
 * @desc remove item from cart
 * @access Private
 * @argument productId - ID of the product to delete
 * @argument variantId - ID of the variant to delete
 */

router.delete(
   "/item/delete/:productId/:variantId",
   authenticateUser,
   removeCartItem,
);

// without variant (base product)
router.delete("/item/delete/:productId", authenticateUser, removeCartItem);

export default router;
