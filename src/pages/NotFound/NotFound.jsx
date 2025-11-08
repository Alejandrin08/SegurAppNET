import React from "react";
import { Link } from "react-router-dom";
import { TbError404 } from "react-icons/tb";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <TbError404 className="not-found-icon" />
      <h1>Página No Encontrada</h1>
      <p>
        Lo sentimos, la página que estás buscando no existe. Es posible que la
        URL sea incorrecta o que la página haya sido movida.
      </p>
      <Link to="/" className="not-found-button">
        Volver al Inicio
      </Link>
    </div>
  );
}

export default NotFound;
