import { Router } from "express";
import {
  getChaptersBySubject,
  createChapter,
  updateChapterStatus,
  deleteChapter,
} from "../controllers/chapterController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.use(verifyToken);

router.get("/:subjectId", getChaptersBySubject);
router.post("/", createChapter);
router.patch("/:id/status", updateChapterStatus);
router.delete("/:id", deleteChapter);

export default router;
