import { useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

function RegisterModal({ show, handleClose }) {
  const [userType, setUserType] = useState("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      return setErrors("All fields are required.");
    }

    if (!formData.email.endsWith("@stud.noroff.no")) {
      return setErrors("Email must be a @stud.noroff.no address.");
    }

    // Simulate successful registration
    console.log("Registering as:", userType, formData);
    // handleClose();
    // Redirect to profile here if needed
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
