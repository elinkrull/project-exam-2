import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

export default function CustomerBookingCard({ booking }) {
  const navigate = useNavigate();
  const venue = booking.venue;

  return (
    <Card className="mb-4">
      <Card.Img
        variant="top"
        src={
          venue?.media?.[0]?.url ||
          "https://via.placeholder.com/300x180?text=No+Image"
        }
        style={{ height: "180px", objectFit: "cover" }}
        onClick={() =>
          navigate(`/venue/${venue.id}`, {
            state: { fromProfile: true },
          })
        }
      />
      <Card.Body>
        <Card.Title>{venue?.name || "Unknown Venue"}</Card.Title>
        <Card.Text>
          <strong>${venue?.price ?? "N/A"}</strong> / night
          <br />
          From: {new Date(booking.dateFrom).toLocaleDateString()}
          <br />
          To: {new Date(booking.dateTo).toLocaleDateString()}
          <br />
          Guests: {booking.guests}
        </Card.Text>
        <div className="d-flex justify-content-end">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() =>
              navigate(`/venue/${venue.id}`, {
                state: { fromProfile: true },
              })
            }>
            View Venue
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
