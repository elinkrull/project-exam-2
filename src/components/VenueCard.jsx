import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function VenueCard({ title, image, price, guests, location }) {
  return (
    <Card style={{ width: "100%" }}>
      <Card.Img variant="top" src={image} alt={title} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{location}</Card.Subtitle>
        <Card.Text>
          <strong>Price:</strong> ${price} / night
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Max guests: {guests}</ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default VenueCard;
