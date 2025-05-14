import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import VenueDetails from "./pages/VenueDetails";
import LoginModal from "./pages/LoginModal";
import EditVenuePage from "./pages/EditVenuePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venue/:id" element={<VenueDetails />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginModal />} />
      <Route path="/edit-venue/:id" element={<EditVenuePage />} />
    </Routes>
  );
}

export default App;
