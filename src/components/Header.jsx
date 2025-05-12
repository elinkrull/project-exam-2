import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Header() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo" onClick={goToHome} style={{ cursor: "pointer" }}>
        Holidaze
      </h1>
      <Navbar />
    </header>
  );
}

export default Header;
