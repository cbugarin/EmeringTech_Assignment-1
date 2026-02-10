import Student from "../models/Student.js";

export async function addStudent(req, res) {
  const student = await Student.create(req.body);
  res.status(201).json({ message: "Student created", student: { id: student._id, studentNumber: student.studentNumber } });
}

export async function listStudents(req, res) {
  const students = await Student.find().select("-password").sort({ createdAt: -1 });
  res.json(students);
}
