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
import NewVenueModal from "../components/NewVenueModal";
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

  const handleDeleteVenue = async (venueId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirm) return;

    const accessToken = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${venueId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.[0]?.message || "Delete failed");
      }

      // Refresh data after deletion
      const storedUser = JSON.parse(localStorage.getItem("user"));
      fetchData(storedUser, accessToken);
    } catch (error) {
      console.error("Delete failed:", error.message);
      alert("Failed to delete venue.");
    }
  };

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
            <NewVenueModal
              show={showNewVenueForm}
              handleClose={() => setShowNewVenueForm(false)}
              onVenueCreated={handleVenueCreated}
            />

            {loading ? (
              <Spinner animation="border" />
            ) : data.length > 0 ? (
              <Row>
                {data.map((venue) => (
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
                            onClick={() => navigate(`/edit-venue/${venue.id}`)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteVenue(venue.id)}>
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
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
