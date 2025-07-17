import "./Header.css";
import { SiParrotsecurity } from "react-icons/si";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <header>
      <div className="header-content">
        <div className="header-logo-container" onClick={handleClick}>
          <SiParrotsecurity className="header-icon" />
          <h1>SegurAppNet</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
