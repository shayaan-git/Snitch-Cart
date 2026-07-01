import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  addProductVariant,
  createProduct,
  updateProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
  updateProductVariant,
  deleteProductVariant,
  deleteProduct,
} from "../controllers/product.controller.js";

import multer from "multer";
import {
  createProductValidator,
  addVariantValidator,
  updateProductValidator,
  updateVariantValidator,
} from "../validator/product.validator.js";

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

/**
 * @route PATCH /api/products/:productId
 * @description Update an existing product's details (except images)
 * @access Private (Seller Only)
 */
router.patch(
  "/:productId",
  authenticateSeller,
//   upload.array("images", 8),
  updateProductValidator,
  updateProduct,
);

/**
 * @route PATCH /api/products/:productId/variants/:variantId
 * @description Update a specific variant of a product
 * @access Private (Seller Only)
 */
router.patch(
  "/:productId/variants/:variantId",
  authenticateSeller,
  updateVariantValidator,
  updateProductVariant,
);

/**
 * @route DELETE /api/products/:productId/variants/:variantId
 * @description Delete a specific variant of a product
 * @access Private (Seller Only)
 */
router.delete(
  "/:productId/variants/:variantId",
  authenticateSeller,
  deleteProductVariant,
);

/**
 * @route DELETE /api/products/:productId
 * @description Delete a product
 * @access Private (Seller Only)
 */
router.delete("/:productId", authenticateSeller, deleteProduct);

/**
 * @route POST /api/products/productId/variants
 * @description Add a new variant to a product
 * @access Private (Seller Only)
 */
router.post(
  "/:productId/variants",
  authenticateSeller,
  upload.array("images", 8),
  addVariantValidator,
  addProductVariant,
);

export default router;