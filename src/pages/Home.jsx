import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import Header from "../components/Header";
import VenueCard from "../components/VenueCard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(
          "https://v2.api.noroff.dev/holidaze/venues"
        );
        const data = await response.json();
        const filteredVenues = data.data.filter((venue) => {
          const name = venue.name?.toLowerCase() || "";

          const hasValidName =
            !name.includes("test") && !/(.)\1\1+/i.test(name); // filters names like "ggg", "aaa", etc.

          const city = venue.location?.city?.trim();
          const country = venue.location?.country?.trim();
          const hasLocation = city && country;

          return hasValidName && hasLocation;
        });

        setVenues(filteredVenues.slice(0, 12));
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      }
    }

    fetchVenues();
  }, []);

  return (
    <main className="homepage">
      <Header />
      <Container className="my-5">
        <h1 className="mb-4">Venues</h1>
        <Row className="g-4">
          {venues.map((venue) => (
            <Col key={venue.id} sm={12} md={6} lg={4}>
              <Link
                to={`/venue/${venue.id}`}
                style={{ textDecoration: "none", color: "inherit" }}>
                <VenueCard
                  title={venue.name}
                  image={
                    venue.media && venue.media.length > 0
                      ? venue.media[0].url
                      : "https://via.placeholder.com/300x180?text=No+Image"
                  }
                  price={venue.price}
                  guests={venue.maxGuests}
                  location={venue.location?.city || "Unknown location"}
                />
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </main>
  );
}

export default Home;
