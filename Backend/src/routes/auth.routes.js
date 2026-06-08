import { Router } from "express";
import {
  validateLogin,
  validateRegistration,
} from "../validator/auth.validator.js";
import {
  googleCallback,
  loginUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import passport from "passport";

const router = Router();

router.post("/register", validateRegistration, registerUser);

router.post("/login", validateLogin, loginUser);

// This route basically redirects the user to Google's OAuth 2.0 consent screen
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// This route might confuse but it's the callback URL that Google redirects to after successful authentication. We handle the logic in the auth.controller.js
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), // session: false because we are not using sessions, we are using JWTs
  googleCallback
);

export default router;
