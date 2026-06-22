import { Router } from "express";
import { getProfile, updateProfile } from "./users.controller.js";
import verifyToken from "../../middleware/verifyToken.js";

const router = Router();

router.use(verifyToken);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
