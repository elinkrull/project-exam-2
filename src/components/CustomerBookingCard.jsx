import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

export default function CustomerBookingCard({ booking }) {
  const navigate = useNavigate();
  const venue = booking.venue;

  const handleCancelBooking = async () => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirm) return;

    const accessToken = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/bookings/${booking.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.errors?.[0]?.message || "Failed to cancel booking"
        );
      }

      // Refresh the profile page to reflect the canceled booking
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

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
        <div className="d-flex justify-content-between">
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
          <Button
            size="sm"
            variant="outline-danger"
            onClick={handleCancelBooking}>
            Cancel Booking
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
