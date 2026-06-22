import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;
