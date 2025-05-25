import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

function Header() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="header">
      <h1 className="logo" onClick={goToHome}>
        Holidaze
      </h1>
      <Navigation />
    </div>
  );
}

export default Header;
