import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProducts} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, //5 MB
  },
});

const router = Router();

// Seller hoga tabhi product create ho payga isliye user ke role ko authenticate karenge fir products create karwa rahe honge
router.post(
  "/",
  authenticateSeller,
  createProductValidator,
  upload.array("images", 7),
  createProduct,
);

// Seller can see products created by him/her
router.get("/seller", authenticateSeller, getSellerProducts);

export default router;
