import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   next();
}

export const createProductValidator = [
   body("title").notEmpty().withMessage("Title is required"),
   body("description").notEmpty().withMessage("Description is required"),
   body("priceAmount").notEmpty().withMessage("Price Amount is required"),
   body("priceCurrency").notEmpty().withMessage("Price Currency is required"),
   validateRequest,
];

export const addVariantValidator = [
   body("priceAmount").notEmpty().withMessage("Price Amount is required"),
   body("priceCurrency").notEmpty().withMessage("Price Currency is required"),
   validateRequest,
];

export const updateProductValidator = [
   body("title").optional().notEmpty().withMessage("Title cannot be empty"),

   body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),

   body("priceAmount")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price Amount must be a positive number"),

   body("priceCurrency")
      .optional()
      .notEmpty()
      .withMessage("Price Currency cannot be empty"),

   body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),

   body("attributes")
      .optional()
      .custom((value) => {
         try {
            JSON.parse(value);
            return true;
         } catch {
            throw new Error("Attributes must be valid JSON");
         }
      }),

   validateRequest,
];

export const updateVariantValidator = [
  body("priceAmount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price Amount must be a positive number"),

  body("priceCurrency")
    .optional()
    .notEmpty()
    .withMessage("Price Currency cannot be empty"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("attributes")
    .optional()
    .custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        throw new Error("Attributes must be valid JSON");
      }
    }),

  validateRequest,
];