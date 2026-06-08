import { Router } from "express";
import {
  validateLogin,
  validateRegistration,
} from "../validator/auth.validator.js";
import { loginUser, registerUser } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", validateRegistration, registerUser);

router.post("/login", validateLogin, loginUser);

export default router;
