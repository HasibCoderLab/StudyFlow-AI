import { Router } from "express";
import { register, login, logout, refresh, getMe } from "./auth.controller.js";
import verifyToken from "../../middleware/verifyToken.js";
import validate from "../../middleware/validate.js";
import { registerSchema, loginSchema } from "./auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getMe);

export default router;
