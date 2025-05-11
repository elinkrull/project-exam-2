import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (!storedUser || !accessToken) {
      navigate("/");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse stored user:", error, storedUser);
      navigate("/");
      return;
    }

    setUser(parsedUser);
    console.log("Parsed user:", parsedUser);

    const fetchData = async () => {
      try {
        const endpoint = parsedUser.venueManager
          ? `https://v2.api.noroff.dev/holidaze/profiles/${parsedUser.name}/venues`
          : `https://v2.api.noroff.dev/holidaze/profiles/${parsedUser.name}/bookings`;

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await res.json();

        if (!res.ok)
          throw new Error(result.errors?.[0]?.message || "Failed to load");

        setData(result.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="container mt-5">
      <h1>Welcome, {user.name}</h1>
      <img
        src={user.avatar || "https://placehold.co/150x150?text=No+Avatar"}
        alt="Avatar"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
      <p>Email: {user.email}</p>
      <button className="btn btn-danger mb-4" onClick={handleLogout}>
        Logout
      </button>

      {user.venueManager ? (
        <>
          <h2>My Venues</h2>
          {loading ? (
            <p>Loading venues...</p>
          ) : data.length > 0 ? (
            <ul>
              {data.map((venue) => (
                <li key={venue.id}>{venue.name}</li>
              ))}
            </ul>
          ) : (
            <p>You have no venues yet.</p>
          )}
        </>
      ) : (
        <>
          <h2>My Bookings</h2>
          {loading ? (
            <p>Loading bookings...</p>
          ) : (
            <ul>
              {data.map((booking) => (
                <li key={booking.id}>
                  {booking.venue?.name} – From: {booking.dateFrom.slice(0, 10)}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePage;
