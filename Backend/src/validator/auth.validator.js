import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateRegistration = [
  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .customSanitizer((value) => value.replace(/[\s+\-]/g, ""))
    .matches(/^\d{10,15}$/)
    .withMessage("Contact must be between 10 and 15 digits"),

  body("fullname")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  body("isSeller").isBoolean().withMessage("isSeller must be a boolean value"),

  validateRequest,
];

export const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validateRequest,
];

