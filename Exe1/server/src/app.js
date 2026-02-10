import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

import Student from "./models/Student.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: config.clientUrl, credentials: true }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

// TEMP dev-only route to create an admin for testing/demo
app.post("/api/dev/seed-admin", async (req, res) => {
  const exists = await Student.findOne({ studentNumber: "admin" });
  if (exists) return res.json({ message: "Admin already exists" });

  const admin = await Student.create({
    studentNumber: "admin",
    password: "Admin1234",
    firstName: "Admin",
    lastName: "User",
    email: "admin@demo.com",
    program: "SET",
    favoriteTopic: "MERN",
    strongestSkill: "Node",
    role: "admin"
  });

  res.status(201).json({ message: "Admin created", admin: { id: admin._id, studentNumber: admin.studentNumber } });
});

export default app;
