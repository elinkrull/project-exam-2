import { useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginModal({ show, handleClose }) {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("customer");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      return setError("All fields are required.");
    }

    try {
      // 1. Login
      const loginRes = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.errors?.[0]?.message || "Login failed.");
      }

      const accessToken = loginData.data.accessToken;
      const userName = loginData.data.name;

      // 2. Create API key
      const keyRes = await fetch(
        "https://v2.api.noroff.dev/auth/create-api-key",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const keyData = await keyRes.json();
      if (!keyRes.ok) {
        throw new Error(
          keyData.errors?.[0]?.message || "API key creation failed."
        );
      }

      const apiKey = keyData.data.key;

      // 3. Fetch user profile
      const profileRes = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        throw new Error(
          profileData.errors?.[0]?.message || "Failed to fetch profile."
        );
      }

      // 4. Merge user info and store
      let fullUserData = {
        ...loginData.data,
        ...profileData.data,
      };

      const isVenueManager = fullUserData.venueManager;
      if (
        (userType === "manager" && !isVenueManager) ||
        (userType === "customer" && isVenueManager)
      ) {
        throw new Error(
          `This account is registered as a ${
            isVenueManager ? "Venue Manager" : "Customer"
          }. Please select the correct role.`
        );
      }
      if (fullUserData.avatar && typeof fullUserData.avatar === "object") {
        fullUserData.avatar = fullUserData.avatar.url;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("apiKey", apiKey);

      handleClose();
      navigate("/profile");

      localStorage.setItem("user", JSON.stringify(fullUserData));
      window.dispatchEvent(new Event("userUpdated"));
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Login as {userType === "manager" ? "Venue Manager" : "Customer"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3 text-center">
          <Col>
            <Button
              variant={userType === "customer" ? "primary" : "outline-primary"}
              onClick={() => setUserType("customer")}
              className="w-100">
              Customer
            </Button>
          </Col>
          <Col>
            <Button
              variant={userType === "manager" ? "primary" : "outline-primary"}
              onClick={() => setUserType("manager")}
              className="w-100">
              Venue Manager
            </Button>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email (@stud.noroff.no)</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
