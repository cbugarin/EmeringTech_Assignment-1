import { useContext } from "react";
import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  if (!user) return null;

  return (
    <Navbar bg="white" expand="sm" className="border-bottom">
      <Container>
        <Navbar.Brand style={{ cursor: "pointer", fontWeight: 800 }} onClick={() => nav("/")}>
          Student/Course System
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link onClick={() => nav("/")}>Student</Nav.Link>
          {user.role === "admin" && <Nav.Link onClick={() => nav("/admin")}>Admin</Nav.Link>}
        </Nav>

        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">{user.firstName} {user.lastName}</span>
          <Badge bg={user.role === "admin" ? "dark" : "primary"}>{user.role}</Badge>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={async () => {
              await logout();
              nav("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}
