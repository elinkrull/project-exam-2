import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import NewVenueForm from "../components/NewVenueForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EditProfileModal from "../components/EditProfileModal";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewVenueForm, setShowNewVenueForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const fetchData = async (parsedUser, accessToken) => {
    try {
      const endpoint = parsedUser.venueManager
        ? `https://v2.api.noroff.dev/holidaze/profiles/${parsedUser.name}/venues`
        : `https://v2.api.noroff.dev/holidaze/profiles/${parsedUser.name}/bookings`;

      const apiKey = localStorage.getItem("apiKey");

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.errors?.[0]?.message || "Failed to load");

      setData(result.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (!storedUser || !accessToken) {
      navigate("/");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse stored user:", error, storedUser);
      navigate("/");
      return;
    }

    setUser(parsedUser);
    fetchData(parsedUser, accessToken);
  }, [navigate]);

  const handleVenueCreated = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("accessToken");
    fetchData(storedUser, accessToken);
    setShowNewVenueForm(false);
  };

  if (!user) return <Spinner animation="border" className="m-5" />;

  return (
    <>
      <Header />
      <Container className="mt-5">
        <Row>
          <Col md={3}>
            <Card className="text-center mb-4">
              <Card.Img
                variant="top"
                src={
                  user.avatar || "https://placehold.co/150x150?text=No+Avatar"
                }
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "20px auto 0",
                }}
              />
              <Card.Body>
                <Card.Title>{user.name}</Card.Title>

                <Button
                  className="btn btn-sm mt-2"
                  onClick={() => setShowEditModal(true)}>
                  Edit Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>{user.venueManager ? "My Venues" : "My Bookings"}</h2>
              {user.venueManager && (
                <Button onClick={() => setShowNewVenueForm(!showNewVenueForm)}>
                  {showNewVenueForm ? "Cancel" : "Add Venue"}
                </Button>
              )}
            </div>

            {showNewVenueForm && (
              <NewVenueForm onVenueCreated={handleVenueCreated} />
            )}

            {loading ? (
              <Spinner animation="border" />
            ) : data.length > 0 ? (
              <ListGroup>
                {data.map((item) => (
                  <ListGroup.Item key={item.id}>
                    {user.venueManager
                      ? item.name
                      : `${item.venue?.name} – From: ${item.dateFrom.slice(
                          0,
                          10
                        )}`}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No {user.venueManager ? "venues" : "bookings"} found.</p>
            )}
          </Col>
        </Row>
      </Container>
      {user && (
        <EditProfileModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          user={user}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />
      )}

      <Footer />
    </>
  );
}

export default ProfilePage;
