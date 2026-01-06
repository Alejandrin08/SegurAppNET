import "./MotivationSection.css";
import { useState } from "react";
import { IoAlertCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { FaBug, FaShieldAlt, FaGraduationCap } from "react-icons/fa";

function MotivationSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: "problem",
      icon: <IoAlertCircleOutline />,
      title: "El desafío en la seguridad del software",
      content: [
        {
          stat: "74%",
          description: "de las aplicaciones web presentan al menos una falla de seguridad",
          source: "Veracode, 2023"
        },
        {
          stat: "66%",
          description: "de los desarrolladores no priorizan la seguridad por falta de tiempo o formación",
          source: "Secure Code Warrior, 2022"
        },
        {
          stat: "69%",
          description: "de las aplicaciones tienen al menos una vulnerabilidad del OWASP Top 10",
          source: "Veracode, 2023"
        }
      ]
    },
    {
      type: "context",
      icon: <FaGraduationCap />,
      title: "En el contexto académico",
      challenges: [
        {
          icon: <FaBug />,
          title: "Funcionalidad sobre seguridad",
          description: "Los estudiantes priorizan completar funcionalidades sobre implementar medidas de seguridad adecuadas."
        },
        {
          icon: <FaBug />,
          title: "Curva de aprendizaje",
          description: "La complejidad de los frameworks y la falta de tiempo limitan la capacidad de aplicar prácticas seguras."
        },
        {
          icon: <FaBug />,
          title: "Falta de recursos prácticos",
          description: "Escasez de material contextualizado que guíe la implementación de seguridad en proyectos académicos."
        }
      ]
    },
    {
      type: "solution",
      icon: <IoCheckmarkCircleOutline />,
      title: "Nuestra solución: SegurAppNet",
      features: [
        {
          icon: <FaShieldAlt />,
          title: "Guía práctica contextualizada",
          description: "Contenido específico para ASP.NET Core con ejemplos reales aplicables a proyectos académicos."
        },
        {
          icon: <FaShieldAlt />,
          title: "Aprendizaje práctico",
          description: "Laboratorios paso a paso que permiten implementar medidas de seguridad de forma guiada."
        },
        {
          icon: <FaShieldAlt />,
          title: "Verificación objetiva",
          description: "Rúbricas de evaluación que ayudan a validar la correcta implementación de prácticas seguras."
        }
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="section motivation-section" id="why-this-guide">
      <h2>¿Por qué esta guía?</h2>
      <div className="container-line">
        <div className="vertical-line"></div>
        <div className="container-read-guide">
          <div className="carousel-wrapper">
            <button
              onClick={prevSlide}
              className="carousel-nav-button carousel-nav-left"
              aria-label="Slide anterior"
            >
              <MdNavigateBefore />
            </button>

            <div className="carousel-container">
              <div className="carousel-content">
                {slides[currentSlide].type === "problem" && (
                  <div className="slide slide-problem">
                    <div className="slide-header">
                      <span className="slide-icon icon-problem">
                        {slides[currentSlide].icon}
                      </span>
                      <h3>{slides[currentSlide].title}</h3>
                    </div>
                    <div className="stats-grid">
                      {slides[currentSlide].content.map((item, index) => (
                        <div key={index} className="stat-card">
                          <div className="stat-number">{item.stat}</div>
                          <p className="stat-description">{item.description}</p>
                          <span className="stat-source">{item.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {slides[currentSlide].type === "context" && (
                  <div className="slide slide-context">
                    <div className="slide-header">
                      <span className="slide-icon icon-context">
                        {slides[currentSlide].icon}
                      </span>
                      <h3>{slides[currentSlide].title}</h3>
                    </div>
                    <div className="challenges-list">
                      {slides[currentSlide].challenges.map((challenge, index) => (
                        <div key={index} className="challenge-item">
                          <div className="challenge-icon">{challenge.icon}</div>
                          <div className="challenge-content">
                            <h4>{challenge.title}</h4>
                            <p>{challenge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {slides[currentSlide].type === "solution" && (
                  <div className="slide slide-solution">
                    <div className="slide-header">
                      <span className="slide-icon icon-solution">
                        {slides[currentSlide].icon}
                      </span>
                      <h3>{slides[currentSlide].title}</h3>
                    </div>
                    <div className="features-grid">
                      {slides[currentSlide].features.map((feature, index) => (
                        <div key={index} className="feature-card">
                          <div className="feature-icon">{feature.icon}</div>
                          <h4>{feature.title}</h4>
                          <p>{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="carousel-indicators">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`indicator ${currentSlide === index ? "active" : ""}`}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              className="carousel-nav-button carousel-nav-right"
              aria-label="Siguiente slide"
            >
              <MdNavigateNext />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MotivationSection;