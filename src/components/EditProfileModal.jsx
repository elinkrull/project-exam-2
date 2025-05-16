import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function EditProfileModal({ show, handleClose, user, onUpdate }) {
  const [avatarUrl, setAvatarUrl] = useState(
    typeof user.avatar === "string" ? user.avatar : ""
  );

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset the avatar URL when the modal opens or when the user changes
  useEffect(() => {
    if (user) {
      setAvatarUrl(typeof user.avatar === "string" ? user.avatar : "");
    }
  }, [user, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const accessToken = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || !apiKey) {
      setError("Missing authentication headers.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${user.name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify({
            avatar: {
              url: avatarUrl,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Update failed");
      }

      const updatedUser = { ...user, avatar: data.data.avatar?.url || "" };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));

      onUpdate(updatedUser);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="url"
              placeholder=""
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={submitting}>
            {submitting ? "Updating..." : "Update Avatar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditProfileModal;
