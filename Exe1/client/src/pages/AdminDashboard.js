import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Alert } from "react-bootstrap";
import api from "../api/axios";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseStudents, setCourseStudents] = useState([]);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    studentNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    program: "SET",
    favoriteTopic: "",
    strongestSkill: "",
    role: "student"
  });

  async function loadStudents() {
    const res = await api.get("/students");
    setStudents(res.data);
  }

  async function loadCourses() {
    const res = await api.get("/courses");
    setCourses(res.data);
  }

  async function load() {
    await Promise.all([loadStudents(), loadCourses()]);
  }

  useEffect(() => { load(); }, []);

  async function addStudent(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      await api.post("/students", form);
      setMsg("Student added!");
      setForm({
        studentNumber: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phoneNumber: "",
        email: "",
        program: "SET",
        favoriteTopic: "",
        strongestSkill: "",
        role: "student"
      });
      await loadStudents();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to add student");
    }
  }

  async function listStudentsInCourse(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      const res = await api.get(`/courses/${selectedCourseId}/students`);
      setCourseStudents(res.data.students || []);
      setMsg("Loaded students for course.");
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load students for course");
    }
  }

  return (
    <Container className="mt-4">
      <h4 className="mb-3">Admin Dashboard</h4>
      {msg && <Alert variant="success">{msg}</Alert>}
      {err && <Alert variant="danger">{err}</Alert>}

      <Row className="g-3">
        <Col lg={6}>
          <Card className="card-clean">
            <Card.Body>
              <h5 className="mb-3">Add Student</h5>
              <Form onSubmit={addStudent}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Student Number</Form.Label>
                      <Form.Control required value={form.studentNumber} onChange={(e) => setForm({ ...form, studentNumber: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Program</Form.Label>
                      <Form.Control required value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Favorite Topic</Form.Label>
                      <Form.Control value={form.favoriteTopic} onChange={(e) => setForm({ ...form, favoriteTopic: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Strongest Skill</Form.Label>
                      <Form.Control value={form.strongestSkill} onChange={(e) => setForm({ ...form, strongestSkill: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit">Add Student</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">Students in a Course</h5>
              <Form onSubmit={listStudentsInCourse}>
                <Form.Group className="mb-2">
                  <Form.Label>Select Course</Form.Label>
                  <Form.Select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required>
                    <option value="">-- choose --</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.courseCode} - {c.courseName} ({c.section})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button type="submit">Load</Button>
              </Form>

              <div className="mt-3">
                <Table bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Student #</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Program</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseStudents.map((s) => (
                      <tr key={s._id}>
                        <td>{s.studentNumber}</td>
                        <td>{s.firstName} {s.lastName}</td>
                        <td>{s.email}</td>
                        <td>{s.program}</td>
                      </tr>
                    ))}
                    {courseStudents.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">No students loaded.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">All Students</h5>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Student #</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Program</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td>{s.studentNumber}</td>
                      <td>{s.firstName} {s.lastName}</td>
                      <td>{s.email}</td>
                      <td>{s.program}</td>
                      <td>{s.role}</td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">All Courses</h5>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Section</th>
                    <th>Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c._id}>
                      <td>{c.courseCode}</td>
                      <td>{c.courseName}</td>
                      <td>{c.section}</td>
                      <td>{c.semester}</td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No courses found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
