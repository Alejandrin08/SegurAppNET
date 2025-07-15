import "./Header.css";
import { SiParrotsecurity } from "react-icons/si";

function Header() {
  return (
    <header>
      <div className="header-content">
        <SiParrotsecurity className="header-icon" />
        <h1>SegurAppNet</h1>
      </div>
    </header>
  );
}

export default Header;
