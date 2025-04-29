import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Header from "../components/Header";
import Footer from "../components/Footer";

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <>
      <Header />
      <Container className="my-5">
        <h1>{venue.name}</h1>
        <img
          src={
            venue.media && venue.media.length > 0
              ? venue.media[0].url
              : "https://via.placeholder.com/600x300?text=No+Image"
          }
          alt={venue.name}
          className="img-fluid mb-4"
        />
        <p>
          <strong>Price:</strong> ${venue.price} / night
        </p>
        <p>
          <strong>Max guests:</strong> {venue.maxGuests}
        </p>
        <p>
          <strong>Location:</strong> {venue.location?.city},{" "}
          {venue.location?.country}
        </p>
        <p>{venue.description}</p>
      </Container>
      <Footer />
    </>
  );
}

export default VenueDetails;
