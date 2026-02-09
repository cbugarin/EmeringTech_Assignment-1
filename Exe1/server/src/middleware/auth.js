import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import Student from "../models/Student.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[config.cookieName];
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await Student.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
}
