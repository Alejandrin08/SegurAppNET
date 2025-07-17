import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MenuBar.css";
import {
  MdExpandMore,
  MdExpandLess,
  MdOutlineSecurity,
  MdHttps,
} from "react-icons/md";
import { FaBookReader, FaUserAltSlash, FaBars } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { FaUserLock } from "react-icons/fa6";
import { SiWebauthn, SiAwssecretsmanager } from "react-icons/si";
import { FcDataProtection } from "react-icons/fc";
import { BsFiletypeHtml } from "react-icons/bs";
import { GiArchiveResearch } from "react-icons/gi";
import { PiUserCircleGearDuotone } from "react-icons/pi";

function MenuBar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    mechanisms: false,
    appendices: false,
  });

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  }, [location.pathname]);

  const handleOverlayClick = () => {
    setMenuOpen(false);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectItem = (itemId) => {
    setSelectedItem((prev) => (prev === itemId ? null : itemId));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <button
        className={`menu-toggle ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : <FaBars />}
      </button>

      <div
        className={`menu-overlay ${menuOpen ? "active" : ""}`}
        onClick={handleOverlayClick}
      />

      <nav
        className={`menu-nav ${menuOpen ? "active" : ""}`}
        aria-hidden={!menuOpen}
      >
        {" "}
        <h2>
          <b>Tabla de contenido</b>
        </h2>
        <div className="menu-section">
          <h3
            className="menu-header"
            onClick={() => toggleSection("introduction")}
          >
            <b>
              <span className="icon-container">
                {expandedSections.introduction ? (
                  <MdExpandLess className="icon-menubar" />
                ) : (
                  <MdExpandMore className="icon-menubar" />
                )}
              </span>
              Introducción
            </b>
          </h3>
          {expandedSections.introduction && (
            <ul className="menu-list">
              <li
                className={`menu-item ${
                  isActive("/") && selectedItem === "how-to-read"
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSelectItem("how-to-read")}
              >
                <Link to="/#how-to-read" className="menu-link">
                  <FaBookReader className="icon-menubar" />
                  <span>¿Cómo leer esta guía?</span>
                </Link>
              </li>

              <li
                className={`menu-item ${
                  isActive("/") && selectedItem === "prerequisites"
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSelectItem("prerequisites")}
              >
                <Link to="/#prerequisites" className="menu-link">
                  <GoChecklist className="icon-menubar" />
                  <span>Prerrequisitos</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
        <div className="menu-section">
          <h3
            className="menu-header"
            onClick={() => toggleSection("mechanisms")}
          >
            <b>
              <span className="icon-container">
                {expandedSections.mechanisms ? (
                  <MdExpandLess className="icon-menubar" />
                ) : (
                  <MdExpandMore className="icon-menubar" />
                )}
              </span>
              Mecanismos de seguridad
            </b>
          </h3>
          {expandedSections.mechanisms && (
            <ul className="menu-list">
              <li
                className={`menu-item ${
                  isActive("/authorization") ? "selected" : ""
                }`}
                onClick={() => handleSelectItem("authorization")}
              >
                <Link to="/authorization" className="menu-link">
                  <MdOutlineSecurity className="icon-menubar" />
                  <span>Autorización</span>
                </Link>
              </li>

              <li
                className={`menu-item ${
                  isActive("/authentication") ? "selected" : ""
                }`}
                onClick={() => handleSelectItem("authentication")}
              >
                <Link to="/authentication" className="menu-link">
                  <FaUserLock className="icon-menubar" />
                  <span>Autenticación</span>
                </Link>
              </li>

              <li
                className={`menu-item ${isActive("/cors") ? "selected" : ""}`}
                onClick={() => handleSelectItem("cors")}
              >
                <Link to="/cors" className="menu-link">
                  <SiWebauthn className="icon-menubar" />
                  <span>CORS</span>
                </Link>
              </li>

              <li
                className={`menu-item ${
                  isActive("/data-protection") ? "selected" : ""
                }`}
                onClick={() => handleSelectItem("data-protection")}
              >
                <Link to="/data-protection" className="menu-link">
                  <FcDataProtection className="icon-menubar" />
                  <span>Protección de datos</span>
                </Link>
              </li>

              <li
                className={`menu-item ${
                  isActive("/secrets-management") ? "selected" : ""
                }`}
                onClick={() => handleSelectItem("secrets-management")}
              >
                <Link to="/secrets-management" className="menu-link">
                  <SiAwssecretsmanager className="icon-menubar" />
                  <span>Manejo de secretos</span>
                </Link>
              </li>

              <li
                className={`menu-item ${
                  isActive("/html-encoder") ? "selected" : ""
                }`}
                onClick={() => handleSelectItem("html-encoder")}
              >
                <Link to="/html-encoder" className="menu-link">
                  <BsFiletypeHtml className="icon-menubar" />
                  <span>HTML Encoder</span>
                </Link>
              </li>

              <li
                className={`menu-item ${isActive("/https") ? "selected" : ""}`}
                onClick={() => handleSelectItem("https")}
              >
                <Link to="/https" className="menu-link">
                  <MdHttps className="icon-menubar" />
                  <span>HTTPS</span>
                </Link>
              </li>

              <li
                className={`menu-item ${
                  isActive("/anti-forgery-tokens") ? "selected" : ""
                }`}
                onClick={() => handleSelectItem("anti-forgery-tokens")}
              >
                <Link to="/anti-forgery-tokens" className="menu-link">
                  <FaUserAltSlash className="icon-menubar" />
                  <span>Tokens anti-falsificaciones</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
        <div className="menu-section-ultimate">
          <h3
            className="menu-header"
            onClick={() => toggleSection("appendices")}
          >
            <b>
              <span className="icon-container">
                {expandedSections.appendices ? (
                  <MdExpandLess className="icon-menubar" />
                ) : (
                  <MdExpandMore className="icon-menubar" />
                )}
              </span>
              Apéndices
            </b>
          </h3>
          {expandedSections.appendices && (
            <ul className="menu-list">
              <li
                className={`menu-item ${
                  isActive("/glossary") ? "selected" : ""
                }`}
                onClick={() => handleSelectItem("glossary")}
              >
                <Link to="/glossary" className="menu-link">
                  <GiArchiveResearch className="icon-menubar" />
                  <span>Glosario</span>
                </Link>
              </li>

              <li
                className={`menu-item ${
                  isActive("/recommended-resources") ? "selected" : ""
                }`}
                onClick={() => handleSelectItem("recommended-resources")}
              >
                <Link to="/recommended-resources" className="menu-link">
                  <PiUserCircleGearDuotone className="icon-menubar" />
                  <span>Recursos recomendados</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
}

export default MenuBar;
