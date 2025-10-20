import "./Rubric.css";
import React, { useLayoutEffect, useRef, useEffect } from "react";

const Rubric = ({ data = [] }) => {
  const gridRef = useRef(null);
  const wrapperRef = useRef(null);
  const headerRefs = useRef([]);

  const hStripesContainerRef = useRef(null);
  const hStripeElements = useRef([]);
  const criterionCellElements = useRef([]);

  const firstColStripeElements = useRef([]);
  const rowHeaderRefs = useRef([]);

  useLayoutEffect(() => {
    const updateVisuals = () => {
      requestAnimationFrame(() => {
        if (
          !gridRef.current ||
          !headerRefs.current[1] ||
          !hStripesContainerRef.current
        )
          return;

        const gridRect = gridRef.current.getBoundingClientRect();
        const secondColHeader = headerRefs.current[1];
        const secondColRect = secondColHeader.getBoundingClientRect();

        const hStripesLeftOffset = secondColRect.left - gridRect.left;
        const hStripesContainerWidth = gridRect.width - hStripesLeftOffset;

        hStripesContainerRef.current.style.left = `${hStripesLeftOffset}px`;
        hStripesContainerRef.current.style.width = `${hStripesContainerWidth}px`;

        criterionCellElements.current.forEach((cell, index) => {
          const stripe = hStripeElements.current[index];
          if (cell && stripe) {
            stripe.style.height = `${cell.offsetHeight}px`;
            stripe.style.top = `${cell.offsetTop}px`;
            stripe.style.display = "block";
          }
        });

        rowHeaderRefs.current.forEach((headerCell, index) => {
          const stripe = firstColStripeElements.current[index];
          if (headerCell && stripe) {
            stripe.style.height = `${headerCell.offsetHeight}px`;
            stripe.style.top = `${headerCell.offsetTop}px`;
            stripe.style.left = `${headerCell.offsetLeft}px`;
            stripe.style.width = `${headerCell.offsetWidth}px`;
            stripe.style.display = "block";
          }
        });
      });
    };

    const observer = new MutationObserver(updateVisuals);
    if (gridRef.current) {
      observer.observe(gridRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    const modalElement = document.getElementById("goodPracticeModal");
    const handleModalShown = () => {
      setTimeout(updateVisuals, 50);
    };

    if (modalElement) {
      modalElement.addEventListener("shown.bs.modal", handleModalShown);
    }

    window.addEventListener("resize", updateVisuals);
    updateVisuals();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateVisuals);
      if (modalElement) {
        modalElement.removeEventListener("shown.bs.modal", handleModalShown);
      }
    };
  }, [data]);

  let currentRow = 2;
  let criterionIndexCounter = 0;
  const totalCriteria = data.reduce(
    (acc, rubric) => acc + rubric.criteria.length,
    0
  );

  hStripeElements.current = [];
  criterionCellElements.current = [];
  firstColStripeElements.current = [];
  rowHeaderRefs.current = [];

  return (
    <div className="rubric-container">
      <div className="rubric-scroll-container">
        {" "}
        <div className="rubric-wrapper" ref={wrapperRef}>
          <div className="vertical-stripes-background">
            {[...Array(4)].map((_, i) => (
              <div key={`v-bg-${i}`} className="vertical-stripe" />
            ))}
          </div>
          <div className="first-col-stripes">
            {data.map((_, i) => (
              <div
                key={`fc-stripe-${i}`}
                ref={(el) => (firstColStripeElements.current[i] = el)}
                className="first-col-stripe"
              />
            ))}
          </div>
          <div className="horizontal-stripes" ref={hStripesContainerRef}>
            {Array.from({ length: totalCriteria }).map((_, i) => (
              <div
                key={`h-stripe-${i}`}
                ref={(el) => (hStripeElements.current[i] = el)}
                className="horizontal-stripe"
              />
            ))}
          </div>
          <div className="rubric-grid" ref={gridRef}>
            <div
              className="rubric-cell header"
              ref={(el) => (headerRefs.current[0] = el)}
            >
              <h3>Rubro</h3>
            </div>
            <div
              className="rubric-cell header"
              ref={(el) => (headerRefs.current[1] = el)}
            >
              <h3>Criterio</h3>
            </div>
            <div
              className="rubric-cell header"
              ref={(el) => (headerRefs.current[2] = el)}
            >
              <h3>Logrado</h3>
            </div>
            <div
              className="rubric-cell header"
              ref={(el) => (headerRefs.current[3] = el)}
            >
              <h3>No logrado</h3>
            </div>

            {data.map((rubric, rubricIndex) => {
              const criteriaCount = rubric.criteria.length;
              const startRow = currentRow;
              currentRow += criteriaCount;
              return (
                <React.Fragment key={`rubric-${rubricIndex}`}>
                  <div
                    className="rubric-cell row-header"
                    ref={(el) => (rowHeaderRefs.current[rubricIndex] = el)}
                    style={{ gridRow: `${startRow} / span ${criteriaCount}` }}
                  >
                    <h3 className="cell-content">{rubric.title}</h3>
                  </div>
                  {rubric.criteria.map((criterion, critIndex) => {
                    const currentCriterionIndex = criterionIndexCounter++;
                    return (
                      <React.Fragment
                        key={`criterion-${rubricIndex}-${critIndex}`}
                      >
                        <div
                          className="rubric-cell"
                          ref={(el) =>
                            (criterionCellElements.current[
                              currentCriterionIndex
                            ] = el)
                          }
                        >
                          <p className="cell-content">
                            {criterion.description}
                          </p>
                        </div>
                        <div className="rubric-cell">
                          <p className="cell-content">{criterion.achieved}</p>
                        </div>
                        <div className="rubric-cell">
                          <p className="cell-content">
                            {criterion.notAchieved}
                          </p>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rubric;
