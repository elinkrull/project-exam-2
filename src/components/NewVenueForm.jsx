import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

function NewVenueForm({ onVenueCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: [],
    imageUrl: "",
    price: "",
    maxGuests: "",
    location: {
      country: "",
      address: "",
      city: "",
      zip: "",
    },
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (["wifi", "parking", "breakfast", "pets"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        meta: { ...prev.meta, [name]: checked },
      }));
    } else if (["country", "address", "city", "zip"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newUrl = e.target.value.trim();
      if (newUrl) {
        setFormData((prev) => ({
          ...prev,
          media: [...prev.media, newUrl],
          imageUrl: "",
        }));
      }
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const apiKey = localStorage.getItem("apiKey");

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/venues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify({
            ...formData,
            media: formData.media.map((url) => ({ url })),
            price: Number(formData.price),
            maxGuests: Number(formData.maxGuests),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Venue creation failed");
      }

      setSuccess("Venue created successfully!");
      setTimeout(() => navigate("/profile"), 1500);
      if (onVenueCreated) onVenueCreated(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="my-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
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
                  onClick={() => removeImage(index)}
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
            value={formData.imageUrl}
            onChange={handleChange}
            onKeyDown={handleImageKeyDown}
            name="imageUrl"
          />
          <Form.Text className="text-muted">Press Enter to add image</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price per night ($)</Form.Label>
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

        <h5 className="mt-4">Location</h5>
        <Form.Group className="mb-2">
          <Form.Control
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={formData.location.address}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            name="city"
            placeholder="City"
            onChange={handleChange}
            value={formData.location.city}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            name="zip"
            placeholder="Zip"
            onChange={handleChange}
            value={formData.location.zip}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            name="country"
            placeholder="Country"
            onChange={handleChange}
            value={formData.location.country}
          />
        </Form.Group>

        <h5 className="mt-4">Facilities</h5>
        <Form.Check
          type="checkbox"
          label="WiFi"
          name="wifi"
          checked={formData.meta.wifi}
          onChange={handleChange}
        />
        <Form.Check
          type="checkbox"
          label="Parking"
          name="parking"
          checked={formData.meta.parking}
          onChange={handleChange}
        />
        <Form.Check
          type="checkbox"
          label="Breakfast included"
          name="breakfast"
          checked={formData.meta.breakfast}
          onChange={handleChange}
        />
        <Form.Check
          type="checkbox"
          label="Pets allowed"
          name="pets"
          checked={formData.meta.pets}
          onChange={handleChange}
        />

        <Button type="submit" className="mt-3">
          Add Venue
        </Button>
      </Form>
    </div>
  );
}

export default NewVenueForm;
