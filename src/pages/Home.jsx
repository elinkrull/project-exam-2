import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Layout from "../components/Layout";
import Spinner from "react-bootstrap/Spinner";
import VenueCard from "../components/VenueCard";
import SearchBar from "../components/SearchBar";

const itemsPerPage = 20;

function Home() {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all venues from paginated API
  useEffect(() => {
    async function fetchAllVenues() {
      const allVenues = [];
      let page = 1;
      const limit = 100;

      setLoading(true); // Start spiner
      setError(null);

      try {
        while (true) {
          const res = await fetch(
            `https://v2.api.noroff.dev/holidaze/venues?limit=${limit}&page=${page}&sort=created&sortOrder=desc`
          );

          const { data } = await res.json();

          if (data.length === 0) break;

          allVenues.push(...data);
          page++;
        }

        // Filter out test/invalid venues
        const filtered = allVenues.filter((venue) => {
          const name = venue.name?.toLowerCase() || "";
          const city = venue.location?.city?.trim();
          const country = venue.location?.country?.trim();
          return (
            !name.includes("test") && !/(.)\1\1+/i.test(name) && city && country
          );
        });

        setVenues(filtered);
      } catch (err) {
        console.error("Failed to fetch venues:", err);
        setError("Failed to load venues. Please try again later.");
      } finally {
        setLoading(false); // Stop spinner
      }
    }

    fetchAllVenues();
  }, []);

  // Reset pagination on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter venues based on search term
  const filteredVenues = venues.filter((venue) => {
    const name = venue.name?.toLowerCase() || "";
    const city = venue.location?.city?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return name.includes(term) || city.includes(term);
  });

  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVenues = filteredVenues.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Layout>
      <Container className="my-5">
        <h1 className="mb-4">Venues</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {error && <p className="text-danger">{error}</p>}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading venues...</p>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {currentVenues.map((venue) => (
                <Col key={venue.id} sm={12} md={6} lg={3}>
                  <Link
                    to={`/venue/${venue.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}>
                    <VenueCard
                      title={venue.name}
                      image={
                        venue.media?.[0]?.url ||
                        "https://via.placeholder.com/300x180?text=No+Image"
                      }
                      price={venue.price}
                      guests={venue.maxGuests}
                      location={venue.location?.city ?? "Unknown location"}
                    />
                  </Link>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                variant="secondary">
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="secondary">
                Next
              </Button>
            </div>
          </>
        )}
      </Container>
    </Layout>
  );
}

export default Home;
