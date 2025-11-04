import "./Footer.css";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <div className="grid-container">
      <div className="grid-item-1">
        <h2>SegurAppNet</h2>
        <p>
          Recurso sobre mejores prácticas y aplicación de la seguridad de las
          aplicaciones web.
        </p>
      </div>
      <div className="grid-item-2">
        <h2>Contenido</h2>
        <ul>
          <li>1. Introducción</li>
          <li>2. Mecanismos de seguridad</li>
          <li>3. Apéndices</li>
        </ul>
      </div>
      <div className="grid-item-3">
        <h2>Laboratorios</h2>
        <a
          href="https://github.com/SegurAppNet/SegurApp-labs.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="icon-footer" />
        </a>
      </div>
      <div className="grid-item-4">
        <div className="line-footer"></div>
      </div>
      <div className="grid-item-5">
        <p>2025 SegurAppNet.</p>
      </div>
    </div>
  );
}

export default Footer;
