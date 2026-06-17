import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, //5 MB
  },
});

const router = Router();

/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller Only)
 */

// Seller hoga tabhi product create ho payga isliye user ke role ko authenticate karenge fir products create karwa rahe honge
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 8),
  createProductValidator,
  createProduct,
);

/**
 * @route GET /api/products/seller
 * @description Get all products of authenticated seller
 * @access Private (Seller only)
 */
// Seller can see products created by him/her
router.get("/seller", authenticateSeller, getSellerProducts);

/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */
router.get("/", getAllProducts);

/**
 * @route GET /api/products/detail/:id
 * @description Get product details by ID
 * @access Public
 */
router.get("/detail/:id", getProductDetails);

export default router;