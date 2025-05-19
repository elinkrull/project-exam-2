import { Card } from "react-bootstrap";

export default function CustomerBookingCard({ booking }) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{booking.venue?.name || "Unnamed Venue"}</Card.Title>
        <Card.Text>
          From: {new Date(booking.dateFrom).toLocaleDateString()} <br />
          To: {new Date(booking.dateTo).toLocaleDateString()} <br />
          Guests: {booking.guests}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
