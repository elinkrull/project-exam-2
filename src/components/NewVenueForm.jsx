import { useState } from "react";
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

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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

  const addImage = () => {
    if (formData.imageUrl) {
      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, formData.imageUrl],
        imageUrl: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/venues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
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
      setFormData({
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

      if (onVenueCreated) {
        onVenueCreated(result.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="my-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <Button variant="secondary" className="mt-2" onClick={addImage}>
            Add Image
          </Button>
          <ul className="mt-2">
            {formData.media.map((url, i) => (
              <li key={i}>{url}</li>
            ))}
          </ul>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Price (NOK)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Max Guests</Form.Label>
          <Form.Control
            type="number"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Location</Form.Label>
          <Form.Control
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={formData.location.address}
          />
          <Form.Control
            name="city"
            placeholder="City"
            onChange={handleChange}
            value={formData.location.city}
          />
          <Form.Control
            name="zip"
            placeholder="Zip"
            onChange={handleChange}
            value={formData.location.zip}
          />
          <Form.Control
            name="country"
            placeholder="Country"
            onChange={handleChange}
            value={formData.location.country}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Amenities</Form.Label>
          <Form.Check
            label="WiFi"
            name="wifi"
            type="checkbox"
            onChange={handleChange}
            checked={formData.meta.wifi}
          />
          <Form.Check
            label="Parking"
            name="parking"
            type="checkbox"
            onChange={handleChange}
            checked={formData.meta.parking}
          />
          <Form.Check
            label="Breakfast"
            name="breakfast"
            type="checkbox"
            onChange={handleChange}
            checked={formData.meta.breakfast}
          />
          <Form.Check
            label="Pets Allowed"
            name="pets"
            type="checkbox"
            onChange={handleChange}
            checked={formData.meta.pets}
          />
        </Form.Group>

        <Button type="submit" className="mt-2">
          Create Venue
        </Button>
      </Form>
    </div>
  );
}

export default NewVenueForm;
