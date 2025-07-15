import "./Modal.css";
import { RiCloseCircleLine } from "react-icons/ri";
import CodeBlock from "../CodeBlock/CodeBlock";
import Rubric from "../Rubric/Rubric";

function Modal({ goodPractices = [] }) {
  return (
    <div
      className="modal fade"
      id="goodPractice"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="goodPracticeLongTitle"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        role="document"
      >
        <div className="modal-content custom-modal-content">
          <div className="modal-header custom-modal-header">
            <h5 className="modal-title" id="goodPracticeLongTitle">
              Modal title
            </h5>
            <button
              type="button"
              className="close-button"
              data-dismiss="modal"
              aria-label="Close"
            >
              <RiCloseCircleLine className="icon-close" />
            </button>
          </div>
          <div className="modal-body custom-modal-body">
            <div className="content-wrapper">
              {goodPractices.map((practice, index) => (
                <div key={index} className="goodpractice-container">
                  <div className="circle-threat circle-dark-blue">
                    {index + 1}
                  </div>
                  <div className="goodpractice-content">
                    <h3>{practice.title}</h3>
                    {practice.description && <p>{practice.description}</p>}
                    {practice.code && <CodeBlock code={practice.code} />}
                    {practice.postCodeText && <p>{practice.postCodeText}</p>}
                    {index < goodPractices.length - 1 && (
                      <div className="line-goodpractice"></div>
                    )}
                  </div>
                </div>
              ))}

              <div className="rubric-section">
                <h2>Rúbrica de evaluación</h2>
                <Rubric />
              </div>
            </div>
          </div>
          <div className="modal-footer custom-modal-footer"></div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
