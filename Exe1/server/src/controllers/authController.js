import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import Student from "../models/Student.js";

function signToken(student) {
  return jwt.sign({ id: student._id, role: student.role }, config.jwtSecret, { expiresIn: "2h" });
}

export async function login(req, res) {
  const { studentNumber, password } = req.body;

  const student = await Student.findOne({ studentNumber });
  if (!student) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await student.matchesPassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(student);
  res.cookie(config.cookieName, token, config.cookieOptions);

  res.json({
    user: { id: student._id, role: student.role, firstName: student.firstName, lastName: student.lastName }
  });
}

export function logout(req, res) {
  res.clearCookie(config.cookieName, { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out" });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
