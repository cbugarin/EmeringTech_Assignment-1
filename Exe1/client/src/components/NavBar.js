import { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container>
        <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => nav("/")}>
          SET Student/Course
        </Navbar.Brand>
        <Nav className="me-auto">
          {user.role === "admin" && <Nav.Link onClick={() => nav("/admin")}>Admin</Nav.Link>}
        </Nav>
        <div className="text-light me-3">{user.firstName} ({user.role})</div>
        <Button variant="outline-light" size="sm" onClick={async () => { await logout(); nav("/login"); }}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}
