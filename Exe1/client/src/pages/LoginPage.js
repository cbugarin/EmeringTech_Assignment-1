import { useContext, useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(studentNumber, password);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <Card className="card-clean w-100" style={{ maxWidth: 440 }}>
        <Card.Body style={{ padding: 22 }}>
          <div className="card-header-clean">Login</div>
          <div className="small-muted mb-3">Use your student number and password.</div>

          {err && <Alert variant="danger">{err}</Alert>}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Student Number</Form.Label>
              <Form.Control value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            <Button type="submit" className="w-100">Login</Button>

            <div className="small-muted mt-3">
              Demo: <b>admin/Admin1234</b> • <b>1001/Pass1234</b>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
