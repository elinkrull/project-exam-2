import { Row, Col } from "react-bootstrap";
import CustomerBookingCard from "./CustomerBookingCard";

export default function MyBookings({ bookings }) {
  return (
    <Row>
      {bookings.map((booking) => (
        <Col md={6} lg={4} key={booking.id}>
          <CustomerBookingCard booking={booking} />
        </Col>
      ))}
    </Row>
  );
}
