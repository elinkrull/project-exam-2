import { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import RegisterModal from "../pages/RegisterModal";
import LoginModal from "../pages/LoginModal";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    } else {
      setUser(null);
    }
  }, [showLogin, showRegister]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <nav className="navbar">
        <Container className="d-flex justify-content-end align-items-center py-3">
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <Image
                src={user.avatar || "https://placehold.co/40x40?text=?"}
                alt="avatar"
                roundedCircle
                width={40}
                height={40}
                style={{ objectFit: "cover" }}
              />
              <span
                className="fw-semibold text-danger"
                role="button"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}>
                Log out
              </span>
            </div>
          ) : (
            <div className="d-flex gap-4 align-items-center">
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
          )}
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
