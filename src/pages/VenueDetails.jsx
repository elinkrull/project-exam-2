import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

        setVenue(json.data);
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
    <main className="homepage">
      <Header />
      <Container className="my-5">
        {venue.media && venue.media.length > 0 ? (
          <div
            className="venue-media mb-4"
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {venue.media.map((media, index) => (
              <img
                key={index}
                src={media.url}
                alt={media.alt || `Venue image ${index + 1}`}
                onClick={() => handleImageClick(index)}
                style={{
                  maxWidth: "200px",
                  height: "auto",
                  cursor: "pointer",
                  borderRadius: "8px",
                  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </div>
        ) : (
          <img
            src="https://via.placeholder.com/600x300?text=No+Image"
            alt="No media available"
            className="img-fluid mb-4"
          />
        )}

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
          <li>WiFi: {venue.meta.wifi ? "✅ Available" : "❌ Not available"}</li>
          <li>
            Parking: {venue.meta.parking ? "✅ Available" : "❌ Not available"}
          </li>
          <li>
            Breakfast:{" "}
            {venue.meta.breakfast ? "✅ Included" : "❌ Not included"}
          </li>
          <li>Pets allowed: {venue.meta.pets ? "✅ Yes" : "❌ No"}</li>
        </ul>
      </Container>
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
      <Footer />
    </main>
  );
}

export default VenueDetails;
