import { useState } from "react";
import "./SecurityMechanismTemplate.css";
import { BsInfoCircleFill } from "react-icons/bs";
import CodeBlock from "../CodeBlock/CodeBlock";
import Carousel from "../Carousel/Carousel";
import Modal from "../Modal/Modal";
import ThreatsVulnerabilities from "../ThreatsVulnerabilities/ThreatsVulnerabilities";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

function SecurityMechanismTemplate({
  securityMechanismTitle,
  definition,
  interestingFacts = [],
  implementationDescription,
  implementationCode,
  goodPractices,
  threats,
}) {
  const [showPractices, setShowPractices] = useState(false);
  const [showThreats, setShowThreats] = useState(false);

  return (
    <div className="security-mechanism">
      <div className="rectangle rectangle-blue">Implementación</div>
      <h1>Mecanismos de seguridad</h1>
      <p>
        Aprenda a implementar la seguridad en los sistemas web con las mejores
        prácticas para proteger sus aplicaciones web de las amenazas más
        comunes.
      </p>
      <div className="horizontal-line"></div>
      <section className="section" id="section-concept">
        <div className="cards card-concept">
          <div className="parent-security">
            <div className="div1-security">
              <h2>{securityMechanismTitle}</h2>
            </div>
            <div className="div2-security">
              <p>{definition}</p>
            </div>

            {interestingFacts.length > 0 && (
              <div
                className={`facts-container ${
                  interestingFacts.length === 1 ? "single-fact" : ""
                }`}
              >
                {interestingFacts.map((fact, index) => (
                  <div
                    key={index}
                    className={`fact-card ${
                      index === 0 ? "fact-blue" : "fact-purple"
                    }`}
                  >
                    <div className="card-header-security">
                      <BsInfoCircleFill className="icons-cards" />
                      <p>{fact.description}</p>
                    </div>
                    {fact.image && (
                      <img
                        src={fact.image}
                        alt={`Interesting fact ${index + 1}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="div4-security">
              <h3>¿Cómo implementarlo?</h3>
              <p>{implementationDescription}</p>
              <CodeBlock code={implementationCode} height="200px" />
            </div>
          </div>
        </div>
      </section>

      <div className="horizontal-line"></div>
      <section className="section" id="section-good-practices">
        <div
          className="icon-container"
          onClick={() => setShowPractices((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          {showPractices ? (
            <MdExpandLess className="icon-size" />
          ) : (
            <MdExpandMore className="icon-size" />
          )}
          <h2>Buenas prácticas</h2>
        </div>
        {showPractices && (
          <div className="cards card-concept">
            <Carousel items={goodPractices} />
            <Modal />
          </div>
        )}
      </section>

      <div className="horizontal-line"></div>
      <section className="section" id="section-threats">
        <div
          className="icon-container"
          onClick={() => setShowThreats((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          {showThreats ? (
            <MdExpandLess className="icon-size" />
          ) : (
            <MdExpandMore className="icon-size" />
          )}
          <h2>Amenazas y vulnerabilidades</h2>
        </div>
        {showThreats && <ThreatsVulnerabilities items={threats} />}
      </section>
    </div>
  );
}

export default SecurityMechanismTemplate;
