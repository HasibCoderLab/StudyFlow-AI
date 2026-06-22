import { Router } from "express";
import {
  logSession,
  getWeeklySummary,
  getMonthlySummary,
} from "../controllers/studyLogController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.use(verifyToken);

router.post("/", logSession);
router.get("/weekly", getWeeklySummary);
router.get("/monthly", getMonthlySummary);

export default router;
