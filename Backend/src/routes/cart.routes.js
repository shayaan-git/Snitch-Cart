import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = express.Router();

/**
 * @route POST /api/cart/:productId/:variantId
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

export default router;
