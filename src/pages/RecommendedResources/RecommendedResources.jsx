import React from "react";
import { SiPostman, SiOwasp, SiHashicorp } from "react-icons/si";
import {
  FaBook,
  FaYoutube,
  FaAws,
  FaGoogle,
  FaMicrosoft,
  FaGithub,
} from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import "./RecommendedResources.css";

function RecommendedResources() {
  return (
    <div className="resources-page">
      <h1>Recursos Recomendados</h1>
      <p className="resources-intro">
        Aquí encontrarás una colección de recursos esenciales, desde
        herramientas de prueba hasta documentación oficial y proveedores de
        servicios.
      </p>

      <section className="resource-section">
        <h2>Herramientas Esenciales</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <div className="card-header">
              <SiPostman className="card-icon postman" />
              <h3>Postman</h3>
            </div>
            <p>
              Indispensable para probar tus APIs. Postman te permite simular
              peticiones y validar la seguridad de tus endpoints.
            </p>
            <ul className="tool-features">
              <li>
                <strong>Headers:</strong> Añade o modifica cabeceras como
                `Authorization` para probar JWT o `X-CSRF-TOKEN`.
              </li>
              <li>
                <strong>Body:</strong> Envía datos en formato JSON o sube
                archivos para probar límites de tamaño.
              </li>
              <li>
                <strong>Métodos:</strong> Ejecuta peticiones GET, POST, PUT,
                DELETE para verificar la protección de tus rutas.
              </li>
            </ul>
            <a
              href="https://www.postman.com/downloads/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Descargar Postman
            </a>
          </div>

          <div className="resource-card">
            <div className="card-header">
              <SiOwasp className="card-icon owasp" />
              <h3>OWASP ZAP</h3>
            </div>
            <p>
              Una potente herramienta de código abierto para encontrar
              vulnerabilidades de seguridad en tu aplicación web de forma
              automática. Ideal para realizar escaneos de seguridad y pruebas de
              penetración.
            </p>
            <a
              href="https://www.zaproxy.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Visitar OWASP ZAP
            </a>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>Plataformas y Servicios en la Nube</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <div className="card-header">
              <h3 className="provider-title">Manejo de Secretos</h3>
            </div>
            <p>
              Alternativas a nivel de producción para el Secret Manager local.
              Estos servicios ofrecen almacenamiento seguro, políticas de acceso
              y auditoría.
            </p>
            <div className="provider-icons">
              <a
                href="https://azure.microsoft.com/es-es/products/key-vault"
                target="_blank"
                rel="noopener noreferrer"
              >
                <VscAzure title="Azure Key Vault" />
              </a>
              <a
                href="https://aws.amazon.com/secrets-manager/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaAws title="AWS Secrets Manager" />
              </a>
              <a
                href="https://www.vaultproject.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiHashicorp title="HashiCorp Vault" />
              </a>
            </div>
          </div>
          <div className="resource-card">
            <div className="card-header">
              <h3 className="provider-title">
                Proveedores de Identidad (OAuth)
              </h3>
            </div>
            <p>
              Integra el inicio de sesión con proveedores externos populares
              para simplificar la autenticación de tus usuarios.
            </p>
            <div className="provider-icons">
              <a
                href="https://developers.google.com/identity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGoogle title="Google Identity" />
              </a>
              <a
                href="https://learn.microsoft.com/es-es/entra/identity-platform/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaMicrosoft title="Microsoft Identity Platform" />
              </a>
              <a
                href="https://docs.github.com/en/apps/oauth-apps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub title="GitHub OAuth" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>Aprendizaje</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <div className="card-header">
              <FaBook className="card-icon docs" />
              <h3>Documentación Oficial</h3>
            </div>
            <p>
              La fuente de información más fiable y actualizada. La sección de
              seguridad de Microsoft Learn es el mejor punto de partida para
              profundizar en cualquier tema.
            </p>
            <a
              href="https://learn.microsoft.com/es-es/aspnet/core/security/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Ir a Microsoft Learn
            </a>
          </div>
          <div className="resource-card">
            <div className="card-header">
              <FaYoutube className="card-icon youtube" />
              <h3>Canales de Video</h3>
            </div>
            <p>
              Recursos visuales para aprender de expertos de la comunidad.
              Canales como el oficial de .NET ofrecen tutoriales prácticos y de
              alta calidad.
            </p>
            <a
              href="https://www.youtube.com/@dotnet"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Ver Canal de .NET
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecommendedResources;
