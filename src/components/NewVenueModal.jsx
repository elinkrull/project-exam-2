import { Modal } from "react-bootstrap";
import NewVenueForm from "./NewVenueForm";

function NewVenueModal({ show, handleClose, onVenueCreated }) {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Venue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NewVenueForm
          onVenueCreated={(venue) => {
            onVenueCreated(venue);
            handleClose();
          }}
        />
      </Modal.Body>
    </Modal>
  );
}

export default NewVenueModal;
