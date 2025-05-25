import { useEffect, useState, forwardRef } from "react";
import { Container, Image, Dropdown } from "react-bootstrap";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { useNavigate, Link } from "react-router-dom";

const CustomToggle = forwardRef(({ onClick }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    id="dropdown-custom-toggle"
    aria-label="Toggle menu">
    ☰
  </button>
));

function Navigation() {
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

  const goToProfile = () => navigate("/profile");

  return (
    <>
      <nav className="navbar">
        <Container className="d-flex justify-content-end align-items-center py-3">
          {user ? (
            <>
              {/* Desktop view */}
              <div className="d-none d-md-flex align-items-center gap-3">
                <span className="fw-semibold text-white text-nowrap">
                  {user.name}
                </span>
                <span role="button" onClick={goToProfile}>
                  <Image
                    src={user.avatar || "/avatar_placeholder.png"}
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

              {/* Mobile view */}
              <div className="d-md-none">
                <Dropdown align="end">
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/">
                      Home
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/">
                      Venues
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </>
          ) : (
            <>
              {/* Desktop view */}
              <div className="d-none d-md-flex gap-4 align-items-center">
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

              {/* Mobile view */}
              <div className="d-md-none">
                <Dropdown align="end">
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setShowRegister(true)}>
                      Register
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowLogin(true)}>
                      Login
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </>
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

export default Navigation;
