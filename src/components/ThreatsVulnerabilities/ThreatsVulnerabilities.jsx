import { useRef, useEffect } from "react";
import "./ThreatsVulnerabilities.css";

function ThreatsVulnerabilities({ items }) {
  const lineRef = useRef(null);
  const lastRowRef = useRef(null);

  const colorList = ["dark-blue", "purple", "dark-yellow", "dark-green"];

  useEffect(() => {
    if (lineRef.current && lastRowRef.current) {
      const containerTop =
        lineRef.current.parentElement.getBoundingClientRect().top;
      const lastRowTop = lastRowRef.current.getBoundingClientRect().top;
      const circleHeight = 50;

      const newHeight = lastRowTop - containerTop + circleHeight / 2;
      lineRef.current.style.height = `${newHeight}px`;
    }
  }, [items.length]);

  return (
    <div className="timeline-container">
      <div className="vertical-line-threat" ref={lineRef}></div>
      {items.map((item, index) => {
        const color = colorList[index]; 
        return (
          <div
            className="timeline-row"
            key={index}
            ref={index === items.length - 1 ? lastRowRef : null}
          >
            <div className={`circle-threat circle-${color}`}></div>
            <div className="cards big-card">
              <h3 className={`title-${color}`}>{item.title}</h3>
              <p>{item.description}</p>
              <div className="good-practice-container">
                {item.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={`rectangle-good-practice rectangle-${color}`}
                  >
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ThreatsVulnerabilities;