import { Card } from "react-bootstrap";

export default function VenueBookings({ venues }) {
  return (
    <div className="mt-4">
      <h4>Bookings on My Venues</h4>
      {venues.map((venue) => (
        <Card key={venue.id} className="mb-3">
          <Card.Body>
            <Card.Title>{venue.name}</Card.Title>
            {venue.bookings?.length > 0 ? (
              <ul className="mb-0">
                {venue.bookings.map((booking) => (
                  <li key={booking.id}>
                    {booking.guests} guest(s) —{" "}
                    {new Date(booking.dateFrom).toLocaleDateString()} to{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No bookings yet.</p>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
