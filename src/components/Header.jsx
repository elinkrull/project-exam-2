import { useNavigate } from "react-router-dom";
import HeaderButtons from "./HeaderButtons";

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
      <HeaderButtons />
    </div>
  );
}

export default Header;
