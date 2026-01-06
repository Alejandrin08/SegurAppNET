import "./Home.css";
import MotivationSection from '../../components/MotivationSection/MotivationSection';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { GiOpenBook } from "react-icons/gi";
import { RiSearchEyeLine, RiVerifiedBadgeLine } from "react-icons/ri";
import { IoAnalyticsOutline } from "react-icons/io5";
import { BsInfoCircleFill, BsFiletypeHtml } from "react-icons/bs";
import { MdOutlineSecurity, MdHttps, MdGppGood } from "react-icons/md";
import { FaUserLock } from "react-icons/fa6";
import { SiWebauthn, SiAwssecretsmanager } from "react-icons/si";
import { FcDataProtection } from "react-icons/fc";
import { FaUserAltSlash } from "react-icons/fa";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        const yOffset = -100;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div>
      <section className="section-introduction">
        <h1>Introducción</h1>
        <p>
          Bienvenido a esta guía sobre seguridad web. Esta guía le guiará a
          través de conceptos fundamentales, implementaciones prácticas y
          recursos esenciales para asegurar sus aplicaciones web de ASP.NET
          Core.
        </p>
        <div className="container-cards">
          <div className="cards introduction-card">
            <span className="icons-container icons-blue">
              <GiOpenBook className="icons-cards" />
            </span>
            <h3>Implementación de seguridad</h3>
            <p>
              Progrese en sus proyectos web incluyendo las mejores prácticas de
              seguridad para ASP.NET Core.
            </p>
          </div>
          <div className="cards introduction-card">
            <span className="icons-container icons-green">
              <MdGppGood className="icons-cards" />
            </span>
            <h3>Prácticas de seguridad</h3>
            <p>
              Realice checklist de las prácticas que realice para aseguramiento
              de la seguridad.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="how-to-read">
        <h2>¿Cómo leer esta guía?</h2>
        <div className="container-line">
          <div className="vertical-line"></div>
          <div className="container-read-guide">
            <p>
              Esta guía ha sido diseñada como un recurso práctico para mostrar
              las prácticas de seguridad en sistemas web.
            </p>

            <div className="container-cards">
              <div className="cards card-blue">
                <div className="card-header">
                  <IoAnalyticsOutline className="icons-cards" />
                  <h3>Contenido práctico y aplicable</h3>
                </div>
                <p>
                  Guía práctica con conceptos, amenazas, buenas prácticas y
                  listas de verificación para sistemas web.
                </p>
              </div>

              <div className="cards card-purple">
                <div className="card-header">
                  <RiSearchEyeLine className="icons-cards" />
                  <h3>Acceso flexible por temas</h3>
                </div>
                <p>
                  Lee de forma secuencial o accede directamente a los temas que
                  quieras reforzar o aplicar.
                </p>
              </div>
            </div>

            <div className="container-big-card">
              <div className="cards big-card">
                <h3>Funciones clave para mejorar su experiencia</h3>
                <ul className="custom-list">
                  <li>
                    <div className="list-item-content">
                      <RiVerifiedBadgeLine className="icono-li" />
                      <div className="text-inline">
                        <h3>Ejemplos prácticos:</h3>
                        <p>
                          escenarios donde se ilustran cómo se aplican los
                          conceptos en la práctica.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="container-big-card">
              <div className="big-card-blue">
                <BsInfoCircleFill className="icons-cards" />
                <p>
                  Al llegar a los apartados prácticos, te recomendamos tener un
                  entorno de desarrollo listo para poder implementar los
                  conceptos abordados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MotivationSection />

      <section className="section" id="prerequisites">
        <h2>Prerrequisitos</h2>
        <div className="container-line">
          <div className="vertical-line"></div>
          <div className="container-read-guide">
            <p>
              Antes de comenzar con esta guía, es importante que cuentes con los
              siguientes conocimientos y herramientas:
            </p>
            <div className="parent">
              <div className="div1">
                <div className="circle circle-yellow">1</div>{" "}
              </div>
              <div className="div2">
                <div className="circle circle-blue">2</div>
              </div>
              <div className="div3">
                <div className="circle circle-green">3</div>
              </div>
              <div className="div4">
                <h3>Conocimientos técnicos</h3>
                <ul>
                  <li>Programación básica en C# y ASP.NET Core.</li>
                  <li>Fundamentos de desarrollo web.</li>
                  <li>Modelo cliente-servidor, HTTP, HTML/CSS y JavaScript</li>
                </ul>
              </div>
              <div className="div5">
                <h3>Entorno de desarrollo</h3>
                <ul>
                  <li>
                    Clonar el repositorio de GitHub para realizar los
                    laboratorios ubicado{" "}
                    <a
                      href="https://github.com/SegurAppNet/SegurApp-labs.git"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      aquí
                    </a>
                    .
                  </li>
                  <li>Visual Studio o VS Code con NET SDK.</li>
                  <li>Base de datos compatible con Entity Framework Core</li>
                </ul>
              </div>
              <div className="div6">
                <h3>Actitud</h3>
                <ul>
                  <li>Compromiso con buenas prácticas de seguridad</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Mecanismos de seguridad</h2>
        <div className="container-line">
          <div className="vertical-line"></div>
          <div className="container-read-guide">
            <p>
              ASP.NET Core incorpora mecanismos de seguridad que permiten
              proteger la integridad, confidencialidad y disponibilidad de las
              aplicaciones. A continuación, se presentan las principales
              mecanismos acompañados de prácticas recomendadas que ayudan a
              prevenir ataques comunes:
            </p>

            <div className="grid-security-mechanism">
              <div className="pair">
                <Link to="/authorization" className="icon-box">
                  <MdOutlineSecurity className="icon-mechanism" />
                </Link>
                <div>
                  <p>Autorización</p>
                </div>
              </div>

              <div className="pair">
                <Link to="/authentication" className="icon-box">
                  <FaUserLock className="icon-mechanism" />
                </Link>
                <div>
                  <p>Autenticación</p>
                </div>
              </div>

              <div className="pair">
                <Link to="/cors" className="icon-box">
                  <SiWebauthn className="icon-mechanism" />
                </Link>
                <div>
                  <p>CORS</p>
                </div>
              </div>

              <div className="pair">
                <Link to="/data-protection" className="icon-box">
                  <FcDataProtection className="icon-mechanism" />
                </Link>
                <div>
                  <p>Protección de datos</p>
                </div>
              </div>

              <div className="pair">
                <Link to="/secrets-management" className="icon-box">
                  <SiAwssecretsmanager className="icon-mechanism" />
                </Link>
                <div>
                  <p>Manejo de secretos</p>
                </div>
              </div>

              <div className="pair">
                <Link to="/html-encoder" className="icon-box">
                  <BsFiletypeHtml className="icon-mechanism" />
                </Link>
                <div>
                  <p>HTML Encoder</p>
                </div>
              </div>

              <div className="pair">
                <Link to="/https" className="icon-box">
                  <MdHttps className="icon-mechanism" />
                </Link>
                <div>
                  <p>HTTPS</p>
                </div>
              </div>

              <div className="pair">
                <Link to="/anti-forgery-tokens" className="icon-box">
                  <FaUserAltSlash className="icon-mechanism" />
                </Link>
                <div>
                  <p>Tokens anti-falsificación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Apéndices</h2>
        <div className="container-line">
          <div className="vertical-line"></div>
          <div className="container-read-guide">
            <div className="container-big-card-appendices">
              <Link
                to="/recommended-resources"
                className="cards big-card"
                id="card-two-appendices"
              >
                <h3>Recursos recomendados</h3>
                <p>
                  Enlaces y documentos útiles para profundizar en los temas
                  abordados.
                </p>
                <div className="p-30 d-flex gap-3 flex-wrap">
                  <div className="rectangle rectangle-purple">
                    Herramientas esenciales
                  </div>
                  <div className="rectangle rectangle-purple">
                    Plataformas y Servicios en la Nube
                  </div>
                  <div className="rectangle rectangle-purple">Aprendizaje</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
