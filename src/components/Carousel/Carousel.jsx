import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Carousel.css";

function Carousel({ items = [], onSelectPractice }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef(null);

  const itemsPerPage = 3;
  const totalPages = items.length - itemsPerPage + 1;
  const maxIndex = Math.max(0, items.length - itemsPerPage);
  const showArrows = items.length > itemsPerPage;
  const [cardWidthWithGap, setCardWidthWithGap] = useState(0);

  useEffect(() => {
    const calculateCardShift = () => {
      if (trackRef.current) {
        const card = trackRef.current.querySelector(".carousel-card");
        const trackStyles = getComputedStyle(trackRef.current);
        const gap = parseFloat(trackStyles.gap) || 0;

        if (card) {
          const cardWidth = card.offsetWidth;
          setCardWidthWithGap(cardWidth + gap);
        }
      }
    };

    calculateCardShift();
    window.addEventListener("resize", calculateCardShift);
    return () => window.removeEventListener("resize", calculateCardShift);
  }, [items.length]);

  const handlePrev = () => {
    if (!isTransitioning && currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      setIsTransitioning(true);
    }
  };

  const handleNext = () => {
    if (!isTransitioning && currentIndex < maxIndex) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      setIsTransitioning(true);
    }
  };

  const goToPage = (pageIndex) => {
    if (!isTransitioning) {
      setCurrentIndex(pageIndex);
      setIsTransitioning(true);
    }
  };

  useEffect(() => {
    const transitionEnd = () => setIsTransitioning(false);
    const track = trackRef.current;

    if (track) {
      track.addEventListener("transitionend", transitionEnd);
      return () => track.removeEventListener("transitionend", transitionEnd);
    }
  }, []);

  const getTransformValue = () => {
    return `translateX(-${currentIndex * cardWidthWithGap}px)`;
  };

  const handleShowDetails = (practice) => {
    if (onSelectPractice) {
      onSelectPractice(practice);
    }

    const modalElement = document.getElementById("goodPracticeModal");
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  return (
    <div className="carousel-container">
      {showArrows && (
        <>
          <button
            className="arrow left"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isTransitioning}
          >
            <FaChevronLeft />
          </button>
          <button
            className="arrow right"
            onClick={handleNext}
            disabled={currentIndex === totalPages - 1 || isTransitioning}
          >
            <FaChevronRight />
          </button>
        </>
      )}

      <div
        className="carousel-track"
        ref={trackRef}
        style={{
          transform: getTransformValue(),
        }}
      >
        {items.map((item, index) => (
          <div className="carousel-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <div className="threats-container">
              {item.threats?.map((threat, i) => (
                <div key={i} className="rectangle-good-practice rectangle-blue">
                  {threat}
                </div>
              ))}
            </div>

            <button
              className="carousel-button"
              onClick={() => handleShowDetails(item)}
            >
              Detalles
            </button>
          </div>
        ))}
      </div>

      {showArrows && (
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;
