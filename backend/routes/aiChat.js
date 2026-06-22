import { Router } from "express";
import { askQuestion } from "../controllers/aiChatController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.post("/ask", verifyToken, askQuestion);

export default router;
