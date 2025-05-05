import { useState } from "react";
import { Container, Modal } from "react-bootstrap";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

function NavBar() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Container className="d-flex justify-content-between align-items-center py-3">
          <div className="d-flex gap-4">
            <span
              role="button"
              className="fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => setShowRegister(true)}>
              Register
            </span>
            <span
              role="button"
              className="fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => setShowLogin(true)}>
              Login
            </span>
          </div>
        </Container>
      </nav>

      <RegisterModal
        show={showRegister}
        handleClose={() => setShowRegister(false)}
      />
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </>
  );
}

export default NavBar;
