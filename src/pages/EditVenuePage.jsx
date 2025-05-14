import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      const token = localStorage.getItem("accessToken");

      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        if (!res.ok)
          throw new Error(json.errors?.[0]?.message || "Failed to fetch venue");

        const data = json.data;

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          maxGuests: data.maxGuests || 1,
          media: data.media?.map((m) => m.url) || [],
          meta: {
            wifi: data.meta?.wifi || false,
            parking: data.meta?.parking || false,
            breakfast: data.meta?.breakfast || false,
            pets: data.meta?.pets || false,
          },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetaChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [name]: checked,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const token = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify({
            ...formData,
            media: formData.media.map((url) => ({ url })),
            meta: formData.meta,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.errors?.[0]?.message || "Failed to update venue");

      navigate("/profile"); // or show a success alert
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="m-5" />;
  if (!formData) return <p>Venue not found.</p>;

  return (
    <>
      <Header />
      <Container className="my-5">
        <h1>Edit Venue</h1>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price (per night)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Max Guests</Form.Label>
            <Form.Control
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Media URLs (comma separated)</Form.Label>
            <Form.Control
              type="text"
              value={formData.media.join(",")}
              onChange={(e) =>
                setFormData({ ...formData, media: e.target.value.split(",") })
              }
            />
          </Form.Group>

          <h5 className="mt-4">Facilities</h5>
          <Form.Check
            type="checkbox"
            label="WiFi"
            name="wifi"
            checked={formData.meta.wifi}
            onChange={handleMetaChange}
          />
          <Form.Check
            type="checkbox"
            label="Parking"
            name="parking"
            checked={formData.meta.parking}
            onChange={handleMetaChange}
          />
          <Form.Check
            type="checkbox"
            label="Breakfast included"
            name="breakfast"
            checked={formData.meta.breakfast}
            onChange={handleMetaChange}
          />
          <Form.Check
            type="checkbox"
            label="Pets allowed"
            name="pets"
            checked={formData.meta.pets}
            onChange={handleMetaChange}
          />

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
}

export default EditVenuePage;
