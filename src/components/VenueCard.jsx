import Card from "react-bootstrap/Card";

function VenueCard({ title, image, price, guests, location }) {
  return (
    <Card className="venue-card mb-4">
      <Card.Img
        variant="top"
        src={image}
        alt={title}
        className="venue-card-img"
      />
      <Card.Body className="venue-card-body">
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{location}</Card.Subtitle>
        <Card.Text>
          <strong>Price:</strong> ${price} / night
        </Card.Text>
        <Card.Text>
          <strong>Max guests:</strong> {guests}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default VenueCard;
