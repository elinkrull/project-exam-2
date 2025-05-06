import { Modal } from "react-bootstrap";

function LoginModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Login form goes here…</p>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
