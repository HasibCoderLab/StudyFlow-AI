import { Router } from "express";
import {
  getSampleQuestions,
  submitQuizAttempt,
  getQuizHistory,
} from "./quiz.controller.js";
import verifyToken from "../../middleware/verifyToken.js";

const router = Router();

router.use(verifyToken);

router.get("/questions", getSampleQuestions);
router.post("/submit", submitQuizAttempt);
router.get("/history", getQuizHistory);

export default router;
