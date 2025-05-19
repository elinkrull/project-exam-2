import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";

export default function MyVenues({ venues, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <Row>
      {venues.map((venue) => (
        <Col md={6} lg={4} key={venue.id} className="mb-4">
          <Card>
            <Card.Img
              variant="top"
              src={
                venue.media?.[0]?.url ||
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
              <Card.Title>{venue.name}</Card.Title>
              <Card.Text>${venue.price} / night</Card.Text>
              <div className="d-flex justify-content-between">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => onEdit(venue.id)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onDelete(venue.id)}>
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
