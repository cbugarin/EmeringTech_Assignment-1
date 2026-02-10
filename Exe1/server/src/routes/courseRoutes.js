import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  listMyCourses,
  addCourseForMe,
  updateMyCourse,
  dropMyCourse,
  listAllCourses,
  listStudentsInCourse
} from "../controllers/courseController.js";

const router = Router();

// Student routes
router.get("/mine", requireAuth, listMyCourses);
router.post("/mine", requireAuth, addCourseForMe);
router.put("/mine/:id", requireAuth, updateMyCourse);
router.delete("/mine/:id", requireAuth, dropMyCourse);

// Admin routes
router.get("/", requireAuth, requireAdmin, listAllCourses);
router.get("/:id/students", requireAuth, requireAdmin, listStudentsInCourse);

export default router;
