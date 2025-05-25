import { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";

function HeaderButtons() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateUser();

    // Listen for custom "userUpdated" event
    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

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
              <span className="fw-semibold text-white text-nowrap">
                {user.name}
              </span>

              <span role="button" onClick={goToProfile}>
                <Image
                  src={user.avatar || "https://placehold.co/40x40?text=?"}
                  alt="avatar"
                  roundedCircle
                  width={40}
                  height={40}
                  style={{ objectFit: "cover", cursor: "pointer" }}
                />
              </span>

              <span
                className="fw-semibold text-white"
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
                className="fw-semibold text-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowRegister(true)}>
                Register
              </span>
              <span
                role="button"
                className="fw-semibold text-white"
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

export default HeaderButtons;
