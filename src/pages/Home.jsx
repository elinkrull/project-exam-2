import { useState, useEffect } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import Footer from "../components/Footer";
import Header from "../components/Header";
import VenueCard from "../components/VenueCard";

function Home() {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(
          "https://v2.api.noroff.dev/holidaze/venues"
        );
        const json = await response.json();
        setVenues(json.data);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      }
    }

    fetchVenues();
  }, []);

  // Filter venues and display only 12
  const filteredVenues = venues
    .filter((venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 12);

  return (
    <main className="homepage">
      <Header />
      <Container className="my-5">
        <h1 className="mb-4">Browse Venues</h1>

        {/* Searchbar */}
        <Form className="mb-4">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search for a venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Form>

        <Row className="g-4">
          {filteredVenues.map((venue) => (
            <Col key={venue.id} sm={12} md={6} lg={4}>
              <VenueCard
                title={venue.name}
                image={
                  venue.media && venue.media.length > 0
                    ? venue.media[0].url
                    : "https://via.placeholder.com/300x180?text=No+Image"
                }
                price={venue.price}
                guests={venue.maxGuests}
                location={venue.location?.city || "Unknown"}
              />
            </Col>
          ))}
        </Row>

        {/* If no results */}
        {filteredVenues.length === 0 && (
          <p className="mt-4">No venues match your search.</p>
        )}
      </Container>
      <Footer />
    </main>
  );
}

export default Home;
