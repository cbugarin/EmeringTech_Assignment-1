import Course from "../models/Course.js";

// Student: list my courses
export async function listMyCourses(req, res) {
  const courses = await Course.find({ students: req.user._id }).sort({ createdAt: -1 });
  res.json(courses);
}

// Student: add course for me (creates a course record and enrolls me)
export async function addCourseForMe(req, res) {
  const { courseCode, courseName, section, semester } = req.body;

  let course = await Course.findOne({ courseCode, semester, courseName });

  if (!course) {
    course = await Course.create({
      courseCode,
      courseName,
      section,
      semester,
      students: [req.user._id]
    });
    return res.status(201).json(course);
  }

  // already exists → enroll student if not enrolled
  const alreadyEnrolled = course.students.some(id => String(id) === String(req.user._id));
  if (!alreadyEnrolled) course.students.push(req.user._id);

  // allow section update on add (optional)
  course.section = section || course.section;

  await course.save();
  res.status(200).json(course);
}

// Student: update course section (only if I'm enrolled)
export async function updateMyCourse(req, res) {
  const { id } = req.params;
  const { section } = req.body;

  const course = await Course.findOne({ _id: id, students: req.user._id });
  if (!course) return res.status(404).json({ message: "Course not found for this student" });

  course.section = section ?? course.section;
  await course.save();

  res.json(course);
}

// Student: drop course (remove myself from students list)
export async function dropMyCourse(req, res) {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  course.students = course.students.filter(sId => String(sId) !== String(req.user._id));
  await course.save();

  res.json({ message: "Dropped course" });
}

// Admin: list all courses
export async function listAllCourses(req, res) {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
}

// Admin: list students in a course
export async function listStudentsInCourse(req, res) {
  const { id } = req.params;

  const course = await Course.findById(id).populate("students", "-password");
  if (!course) return res.status(404).json({ message: "Course not found" });

  res.json({
    courseId: course._id,
    courseCode: course.courseCode,
    courseName: course.courseName,
    section: course.section,
    semester: course.semester,
    students: course.students
  });
}
