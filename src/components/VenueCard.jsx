import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function VenueCard() {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Img
          variant="top"
          src="https://via.placeholder.com/286x180.png?text=Venue+Image"
        />

        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Venue Name</ListGroup.Item>

        <ListGroup.Item>Price/night</ListGroup.Item>
        <ListGroup.Item>Max number of guests</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link href="#">Card Link</Card.Link>
      </Card.Body>
    </Card>
  );
}

export default VenueCard;
