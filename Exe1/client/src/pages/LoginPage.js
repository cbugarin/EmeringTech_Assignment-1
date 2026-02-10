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
    <Container className="d-flex justify-content-center mt-5">
      <Card className="shadow w-100" style={{ maxWidth: 420 }}>
        <Card.Body>
          <h3 className="mb-2">Welcome</h3>
          <p className="text-muted">Login to manage your courses.</p>
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
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
