import { Router } from "express";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "./subjects.controller.js";
import verifyToken from "../../middleware/verifyToken.js";

const router = Router();

router.use(verifyToken);

router.get("/", getSubjects);
router.post("/", createSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
