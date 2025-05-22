import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ReservationBox from "../components/ReservationBox";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);

  const location = useLocation();
  const fromProfile = location.state?.fromProfile || false;
  const navigate = useNavigate();

  function handleImageClick(index) {
    setCurrentIndex(index);
    setShowModal(true);
  }
  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        const json = await response.json();
        const venueData = json.data;

        setVenue(venueData);

        // 📅 Extract booked dates from bookings
        const bookings = venueData.bookings || [];
        const dates = bookings.flatMap((booking) => {
          const start = new Date(booking.dateFrom);
          const end = new Date(booking.dateTo);
          const range = [];
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            range.push(new Date(d));
          }
          return range;
        });

        setBookedDates(dates);
      } catch (error) {
        console.error("Error fetching venue:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <p>Loading venue...</p>;
  if (!venue) return <p>Venue not found.</p>;

  return (
    <Layout>
      <Container className="my-5">
        <Row>
          <Col md={8}>
            <div className="venue-images mb-4">
              {venue.media && venue.media.length > 0 ? (
                <>
                  <div
                    className="hero-image"
                    onClick={() => handleImageClick(0)}>
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt || "Main image"}
                    />
                  </div>
                  <div className="image-grid mt-3">
                    {venue.media.slice(1, 5).map((media, index) => (
                      <img
                        key={index + 1}
                        src={media.url}
                        alt={media.alt || `Venue image ${index + 2}`}
                        onClick={() => handleImageClick(index + 1)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <img
                  src="https://via.placeholder.com/600x300?text=No+Image"
                  alt="No media available"
                  className="no-image-placeholder"
                />
              )}
            </div>

            <h1>{venue.name}</h1>
            <p>
              <strong>Location:</strong> {venue.location?.city},{" "}
              {venue.location?.country}
            </p>
            <p>
              <strong>Price:</strong> ${venue.price} / night
            </p>
            <p>
              <strong>Max guests:</strong> {venue.maxGuests}
            </p>
            <p>{venue.description}</p>
            <h4>Facilities</h4>
            <ul>
              <li>
                WiFi: {venue.meta.wifi ? "✅ Available" : "❌ Not available"}
              </li>
              <li>
                Parking:{" "}
                {venue.meta.parking ? "✅ Available" : "❌ Not available"}
              </li>
              <li>
                Breakfast:{" "}
                {venue.meta.breakfast ? "✅ Included" : "❌ Not included"}
              </li>
              <li>Pets allowed: {venue.meta.pets ? "✅ Yes" : "❌ No"}</li>
            </ul>
          </Col>

          {/* Reservation Box */}
          {!fromProfile && (
            <Col md={4}>
              <ReservationBox
                venue={venue}
                bookedDates={bookedDates}
                isLoggedIn={!!localStorage.getItem("token")}
                onBookingConfirmed={() => {
                  navigate("/profile", {
                    state: {
                      bookingSuccess: true,
                      refreshBookings: Date.now(),
                    },
                  });
                }}
              />
            </Col>
          )}
        </Row>
      </Container>

      {/* Image Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered>
        <Modal.Body className="p-0">
          <Carousel
            activeIndex={currentIndex}
            onSelect={(i) => setCurrentIndex(i)}
            interval={null}>
            {venue.media.map((media, index) => (
              <Carousel.Item key={index}>
                <img
                  src={media.url}
                  alt={media.alt || `Venue image ${index + 1}`}
                  className="d-block w-100"
                  style={{ maxHeight: "80vh", objectFit: "cover" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default VenueDetails;
