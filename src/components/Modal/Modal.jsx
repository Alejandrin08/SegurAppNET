import "./Modal.css";
import { RiCloseCircleLine } from "react-icons/ri";
import CodeBlock from "../CodeBlock/CodeBlock";
import Rubric from "../Rubric/Rubric";

function Modal({ goodPractice }) {
  const { title, practices = [], rubric } = goodPractice?.modalContent || {};

  const closeModal = () => {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("goodPracticeModal")
    );
    modal.hide();
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
            {practices.map((practice, index) => (
              <div key={index} className="goodpractice-container">
                <div className="circle-threat circle-dark-blue">
                  {index + 1}
                </div>
                <div className="goodpractice-content">
                  <h3>{practice.title}</h3>
                  {practice.description && <p>{practice.description}</p>}
                  <div className="code-block-container">
                    {practice.code && <CodeBlock code={practice.code} />}
                  </div>
                  {practice.postCodeText && <p>{practice.postCodeText}</p>}
                  {index < practices.length - 1 && (
                    <div className="line-goodpractice"></div>
                  )}
                </div>
              </div>
            ))}
            <div className="rubric-section">
              <h2>Rúbrica de evaluación</h2>
              {rubric && <Rubric dynamicCells={rubric.dynamicCells} />}
            </div>
          </div>
          <div className="modal-footer custom-modal-footer"></div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
