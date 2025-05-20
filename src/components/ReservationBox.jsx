import { useState } from "react";
import { Form, Button, Modal, Toast, ToastContainer } from "react-bootstrap";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";

function ReservationBox({ venue, bookedDates, onBookingConfirmed }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [guests, setGuests] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if user is logged in based on localStorage
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleReserveClick = () => {
    if (!isLoggedIn) {
      alert("You must be logged in to make a reservation.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = () => {
    const bookingData = {
      dateFrom: range[0].startDate,
      dateTo: range[0].endDate,
      guests,
    };
    onBookingConfirmed(bookingData);
    setShowModal(false);
    setShowToast(true);

    setTimeout(() => {
      navigate("/profile");
    }, 2000);
  };

  return (
    <div className="reservation-box p-4 border rounded shadow-sm bg-light">
      <h5>Make a Reservation</h5>
      <DateRange
        ranges={range}
        onChange={(item) => setRange([item.selection])}
        minDate={new Date()}
        disabledDates={bookedDates}
      />
      <Form.Group className="mb-3">
        <Form.Label>Number of guests</Form.Label>
        <Form.Control
          type="number"
          min={1}
          max={venue.maxGuests}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
        />
      </Form.Group>
      <Button className="mt-3 w-100" onClick={handleReserveClick}>
        Make a Reservation
      </Button>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide>
          <Toast.Header>
            <strong className="me-auto">Booking Confirmed</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Your booking was made successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Dates:</strong> {range[0].startDate.toDateString()} –{" "}
            {range[0].endDate.toDateString()}
          </p>
          <p>
            <strong>Guests:</strong> {guests}
          </p>
          <p>
            <strong>Venue:</strong> {venue.name}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReservationBox;
