import { Router } from "express";
import { addStudent, listStudents } from "../controllers/studentController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Admin only
router.post("/", requireAuth, requireAdmin, addStudent);
router.get("/", requireAuth, requireAdmin, listStudents);

export default router;
