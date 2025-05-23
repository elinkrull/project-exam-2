import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import NewVenueModal from "../components/NewVenueModal";
import EditProfileModal from "../components/EditProfileModal";
import MyVenues from "../components/MyVenues";
import MyBookings from "../components/MyBookings";
import Layout from "../components/Layout";
import VenueBookings from "../components/VenueBookings";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewVenueForm, setShowNewVenueForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (parsedUser, accessToken) => {
    const apiKey = localStorage.getItem("apiKey");

    try {
      if (parsedUser.venueManager) {
        // Fetch venues created by manager
        const venuesRes = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${parsedUser.name}/venues?_bookings=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        const venuesResult = await venuesRes.json();
        if (!venuesRes.ok)
          throw new Error(
            venuesResult.errors?.[0]?.message || "Failed to load venues"
          );
        setVenues(venuesResult.data);
      } else {
        // Fetch bookings for customer
        const bookingsRes = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${parsedUser.name}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        const bookingsResult = await bookingsRes.json();
        if (!bookingsRes.ok)
          throw new Error(
            bookingsResult.errors?.[0]?.message || "Failed to load bookings"
          );
        setBookings(bookingsResult.data);
      }
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
      console.error("Failed to parse stored user:", error);
      navigate("/");
      return;
    }

    setUser(parsedUser);
    fetchData(parsedUser, accessToken);
  }, [navigate, location.key]);

  const handleVenueCreated = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("accessToken");
    fetchData(storedUser, accessToken);
    setShowNewVenueForm(false);
  };

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

  if (!user) return <Spinner animation="border" className="m-5" />;

  return (
    <>
      <Layout>
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
                <h2>My Profile</h2>
                {user.venueManager && (
                  <Button
                    onClick={() => setShowNewVenueForm(!showNewVenueForm)}>
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
              ) : (
                <>
                  {user.venueManager ? (
                    <>
                      <h3 className="mb-3">My Venues</h3>
                      {venues.length > 0 ? (
                        <>
                          <MyVenues
                            venues={venues}
                            onEdit={(id) => navigate(`/edit-venue/${id}`)}
                            onDelete={handleDeleteVenue}
                          />
                          <VenueBookings venues={venues} />
                        </>
                      ) : (
                        <p>No venues found.</p>
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="mb-3">My Bookings</h3>
                      {bookings.length > 0 ? (
                        <MyBookings bookings={bookings} />
                      ) : (
                        <p>No bookings found.</p>
                      )}
                    </>
                  )}
                </>
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
      </Layout>
    </>
  );
}

export default ProfilePage;
