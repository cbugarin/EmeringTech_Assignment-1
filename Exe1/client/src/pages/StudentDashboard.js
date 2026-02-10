import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Alert } from "react-bootstrap";
import api from "../api/axios";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [form, setForm] = useState({ courseCode: "", courseName: "", section: "", semester: "" });
  const [updateSection, setUpdateSection] = useState({ id: "", section: "" });

  async function load() {
    const res = await api.get("/courses/mine");
    setCourses(res.data);
  }

  useEffect(() => { load(); }, []);

  async function addCourse(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      await api.post("/courses/mine", form);
      setForm({ courseCode: "", courseName: "", section: "", semester: "" });
      setMsg("Course added!");
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to add course");
    }
  }

  async function updateCourse(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      await api.put(`/courses/mine/${updateSection.id}`, { section: updateSection.section });
      setUpdateSection({ id: "", section: "" });
      setMsg("Course updated!");
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to update course");
    }
  }

  async function dropCourse(id) {
    setMsg(""); setErr("");
    try {
      await api.delete(`/courses/mine/${id}`);
      setMsg("Course dropped!");
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to drop course");
    }
  }

  return (
    <Container className="mt-4">
      <h4 className="mb-3">Student Dashboard</h4>
      {msg && <Alert variant="success">{msg}</Alert>}
      {err && <Alert variant="danger">{err}</Alert>}

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">Add a Course</h5>
              <Form onSubmit={addCourse}>
                {["courseCode", "courseName", "section", "semester"].map((k) => (
                  <Form.Group className="mb-2" key={k}>
                    <Form.Label className="text-capitalize">{k}</Form.Label>
                    <Form.Control
                      value={form[k]}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      required
                    />
                  </Form.Group>
                ))}
                <Button type="submit">Add Course</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">Update Course (Section)</h5>
              <Form onSubmit={updateCourse}>
                <Form.Group className="mb-2">
                  <Form.Label>Select Course</Form.Label>
                  <Form.Select
                    value={updateSection.id}
                    onChange={(e) => setUpdateSection({ ...updateSection, id: e.target.value })}
                    required
                  >
                    <option value="">-- choose --</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.courseCode} ({c.section})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>New Section</Form.Label>
                  <Form.Control
                    value={updateSection.section}
                    onChange={(e) => setUpdateSection({ ...updateSection, section: e.target.value })}
                    required
                  />
                </Form.Group>

                <Button type="submit">Update</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">My Courses</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Section</th>
                    <th>Semester</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c._id}>
                      <td>{c.courseCode}</td>
                      <td>{c.courseName}</td>
                      <td>{c.section}</td>
                      <td>{c.semester}</td>
                      <td>
                        <Button variant="outline-danger" size="sm" onClick={() => dropCourse(c._id)}>
                          Drop
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">No courses yet.</td>
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
