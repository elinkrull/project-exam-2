import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VenueCard from "../components/VenueCard";
import SearchBar from "../components/SearchBar";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function Home() {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchVenues = useCallback(async () => {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues?sort=created&sortOrder=desc&limit=12&page=${page}`
      );
      const { data } = await response.json();

      const newVenues = data.filter((venue) => {
        const name = venue.name?.toLowerCase() ?? "";
        const city = venue.location?.city?.trim();
        const country = venue.location?.country?.trim();
        const isNameValid = !name.includes("test") && !/(.)\1\1+/i.test(name);
        const hasLocation = city && country;
        return isNameValid && hasLocation;
      });

      setVenues((prev) => [...prev, ...newVenues]);
      setHasMore(data.length > 0);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    }
  }, [page]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, [hasMore]);

  // Filtered venues (search)
  const filteredVenues = venues.filter((venue) => {
    const name = venue.name?.toLowerCase() ?? "";
    const city = venue.location?.city?.toLowerCase() ?? "";
    const term = searchTerm.toLowerCase();
    return name.includes(term) || city.includes(term);
  });

  return (
    <Layout>
      <Container className="my-5">
        <h1 className="mb-4">Venues</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <Row className="g-4">
          {filteredVenues.map((venue) => (
            <Col key={venue.id} sm={12} md={6} lg={4}>
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

        <div ref={loaderRef} className="text-center mt-4">
          {hasMore ? <p>Loading more venues...</p> : <p>No more venues</p>}
        </div>
      </Container>
    </Layout>
  );
}

export default Home;
