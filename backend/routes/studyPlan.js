import { Router } from "express";
import {
  getCurrentPlan,
  generatePlan,
  toggleTaskCompletion,
} from "../controllers/studyPlanController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.use(verifyToken);

router.get("/", getCurrentPlan);
router.post("/generate", generatePlan);
router.patch("/:planId/day/:dayIndex/task/:taskId", toggleTaskCompletion);

export default router;
