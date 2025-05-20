import { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function ReservationBox({
  venue,
  bookedDates,
  onBookingConfirmed,
  isLoggedIn,
}) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [guests, setGuests] = useState(1);
  const [showModal, setShowModal] = useState(false);

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
