import { Router } from "express";
import { askQuestion } from "./aiChat.controller.js";
import verifyToken from "../../middleware/verifyToken.js";

const router = Router();

router.post("/ask", verifyToken, askQuestion);

export default router;
