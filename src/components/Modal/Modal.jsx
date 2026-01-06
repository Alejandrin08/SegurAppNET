import "./Modal.css";
import { RiCloseCircleLine } from "react-icons/ri";
import { BsLightbulbFill, BsExclamationTriangleFill } from "react-icons/bs";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import CodeBlock from "../CodeBlock/CodeBlock";
import Rubric from "../Rubric/Rubric";

function Modal({ goodPractice }) {
  const { recommendation, warning, githubUrl } = goodPractice || {};
  const { title, practices = [], rubric } = goodPractice?.modalContent || {};

  const closeModal = () => {
    if (window.bootstrap) {
      const modalElement = document.getElementById("goodPracticeModal");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  };

  return (
    <div
      className="modal fade"
      id="goodPracticeModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="goodPracticeLongTitle"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        role="document"
      >
        <div className="modal-content custom-modal-content">
          <div className="modal-header custom-modal-header">
            <h5 className="modal-title" id="goodPracticeLongTitle">
              {title}
            </h5>
            <button
              type="button"
              className="close-button"
              onClick={closeModal}
              aria-label="Close"
            >
              <RiCloseCircleLine className="icon-close" />
            </button>
          </div>
          <div className="modal-body custom-modal-body">
            {githubUrl && (
              <div className="github-banner">
                  <div className="github-banner-content">
                  <div className="github-icon-container">
                      <FaGithub className="github-icon" />
                  </div>
                  <div className="github-text">
                      <h4>¿Listo para practicar?</h4>
                      <p>
                      Clona el repositorio de esta práctica para seguir paso a paso los ejemplos.
                      </p>
                  </div>
                  
                  <a 
                      href={githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="github-link"
                  >
                      <span>Ir al repositorio</span>
                      <FaExternalLinkAlt className="external-icon" />
                  </a>
                  </div>
              </div>
            )}
            <div className="info-boxes-container">
              {recommendation && (
                <div className="info-box recommendation">
                  <BsLightbulbFill className="info-box-icon" />
                  <p>
                    <strong>Recomendado para:</strong> {recommendation}
                  </p>
                </div>
              )}
              {warning && (
                <div className="info-box warning">
                  <BsExclamationTriangleFill className="info-box-icon" />
                  <p>
                    <strong>Advertencia:</strong> {warning}
                  </p>
                </div>
              )}
            </div>

            {practices.map((practice, index) => (
              <div key={index} className="goodpractice-container">
                <div className="circle-threat circle-dark-blue">
                  {index + 1}
                </div>
                <div className="goodpractice-content">
                  <h3>{practice.title}</h3>
                  <div className="practice-details">
                    {practice.description && <p>{practice.description}</p>}
                    <div className="code-block-container">
                      {practice.code && <CodeBlock code={practice.code} />}
                    </div>
                    {practice.postCodeText && <p>{practice.postCodeText}</p>}
                  </div>
                  {index < practices.length - 1 && (
                    <div className="line-goodpractice"></div>
                  )}
                </div>
              </div>
            ))}

            <div className="rubric-section">
              <h2>Rúbrica de evaluación</h2>
              {rubric && <Rubric data={rubric.rubricData} />}
            </div>
          </div>
          <div className="modal-footer custom-modal-footer"></div>
        </div>
      </div>
    </div>
  );
}

export default Modal;