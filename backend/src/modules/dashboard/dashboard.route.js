import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller.js";
import verifyToken from "../../middleware/verifyToken.js";

const router = Router();

router.get("/", verifyToken, getDashboardStats);

export default router;
