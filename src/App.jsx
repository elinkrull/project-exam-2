import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/Profile";
import VenueDetails from "./pages/VenueDetails";
import LoginModal from "./pages/LoginModal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venue/:id" element={<VenueDetails />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginModal />} />
    </Routes>
  );
}

export default App;
