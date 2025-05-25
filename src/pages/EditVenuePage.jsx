import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";
import Layout from "../components/Layout";

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
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "maxGuests"].includes(name) ? Number(value) : value,
    }));
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

      navigate(`/venue/${id}`);
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
      <Layout>
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
              <Form.Label>Media</Form.Label>
              <div className="d-flex flex-wrap gap-3 mb-2">
                {formData.media.map((url, index) => (
                  <div
                    key={index}
                    className="position-relative"
                    style={{ width: "100px" }}>
                    <img
                      src={url}
                      alt={`Media ${index}`}
                      style={{
                        width: "100px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          media: prev.media.filter((_, i) => i !== index),
                        }))
                      }
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        borderRadius: "50%",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.75rem",
                      }}>
                      ×
                    </Button>
                  </div>
                ))}
              </div>

              <Form.Control
                type="text"
                placeholder="Add image URL"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const newUrl = e.target.value.trim();
                    if (newUrl) {
                      setFormData((prev) => ({
                        ...prev,
                        media: [...prev.media, newUrl],
                      }));
                      e.target.value = "";
                    }
                  }
                }}
              />
              <Form.Text className="text-muted">
                Press Enter to add image
              </Form.Text>
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
      </Layout>
    </>
  );
}

export default EditVenuePage;
