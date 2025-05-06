import { useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function RegisterModal({ show, handleClose }) {
  const [userType, setUserType] = useState("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      return setErrors("All fields are required.");
    }

    if (!formData.email.endsWith("@stud.noroff.no")) {
      return setErrors("Email must be a @stud.noroff.no address.");
    }

    try {
      // 1. Register
      const registerRes = await fetch(
        "https://v2.api.noroff.dev/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            bio: "", // Optional
            venueManager: userType === "manager",
          }),
        }
      );

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(
          registerData.errors?.[0]?.message || "Registration failed"
        );
      }

      // 2. Login right after
      const loginRes = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.errors?.[0]?.message || "Login failed");
      }

      const accessToken = loginData.data.accessToken;

      // 3. Get Profile from auction endpoint
      const userName = loginData.data.name;

      const profileRes = await fetch(
        `https://v2.api.noroff.dev/auction/profiles/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const profileData = await profileRes.json();

      // 4. Create API key
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
          keyData.errors?.[0]?.message || "API key creation failed"
        );
      }

      const apiKey = keyData.data.key;

      // 5. Save to localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("user", JSON.stringify(profileData.data));

      // 6. Done!
      handleClose();
      navigate("/profile");
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Register as {userType === "manager" ? "Venue Manager" : "Customer"}
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

        {errors && <Alert variant="danger">{errors}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email (@stud.noroff.no)</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              pattern="^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$"
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
            Register
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;
