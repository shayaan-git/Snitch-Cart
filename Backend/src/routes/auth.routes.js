import { Router } from "express";
import { validateRegistration } from "../validator/auth.validator.js";
import { registerUser } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", validateRegistration, registerUser )

export default router;
