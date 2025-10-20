import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Carousel.css";

function Carousel({ items = [], onSelectPractice }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef(null);
  const [cardWidthWithGap, setCardWidthWithGap] = useState(0);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPageDesktop = 3;
  const showDesktopControls = items.length > itemsPerPageDesktop;
  const maxIndexDesktop = showDesktopControls
    ? items.length - itemsPerPageDesktop
    : 0;

  const showMobileControls = items.length > 1;
  const maxIndexMobile = items.length - 1;

  const showDots = isMobileView ? showMobileControls : showDesktopControls;
  const dotCount = isMobileView ? items.length : maxIndexDesktop + 1;
  const currentMaxIndex = isMobileView ? maxIndexMobile : maxIndexDesktop;

  useEffect(() => {
    const calculateCardShift = () => {
      if (trackRef.current) {
        const card = trackRef.current.querySelector(".carousel-card");
        if (card) {
          const trackStyles = getComputedStyle(trackRef.current);
          const gap = parseFloat(trackStyles.gap) || 0;
          setCardWidthWithGap(card.offsetWidth + gap);
        }
      }
    };

    const timer = setTimeout(calculateCardShift, 100);
    window.addEventListener("resize", calculateCardShift);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateCardShift);
    };
  }, [items.length]);

  useEffect(() => {
    const transitionEnd = () => setIsTransitioning(false);
    const track = trackRef.current;
    if (track) {
      track.addEventListener("transitionend", transitionEnd);
      return () => {
        if (track) {
          track.removeEventListener("transitionend", transitionEnd);
        }
      };
    }
  }, []);

  const handlePrev = () => {
    if (!isTransitioning && currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isTransitioning && currentIndex < currentMaxIndex) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPage = (pageIndex) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(pageIndex);
    }
  };

  const handleShowDetails = (practice) => {
    if (onSelectPractice) {
      onSelectPractice(practice);
    }
    if (window.bootstrap) {
      const modalElement = document.getElementById("goodPracticeModal");
      if (modalElement) {
        const modalInstance =
          window.bootstrap.Modal.getInstance(modalElement) ||
          new window.bootstrap.Modal(modalElement);
        modalInstance.show();
      }
    }
  };

  const transformValue = `translateX(-${currentIndex * cardWidthWithGap}px)`;

  return (
    <div className="carousel-container" data-item-count={items.length}>
      <button
        className="arrow left"
        onClick={handlePrev}
        disabled={currentIndex === 0 || isTransitioning}
        style={{
          display: (isMobileView ? showMobileControls : showDesktopControls)
            ? "flex"
            : "none",
        }}
      >
        <FaChevronLeft />
      </button>
      <button
        className="arrow right"
        onClick={handleNext}
        disabled={currentIndex === currentMaxIndex || isTransitioning}
        style={{
          display: (isMobileView ? showMobileControls : showDesktopControls)
            ? "flex"
            : "none",
        }}
      >
        <FaChevronRight />
      </button>

      <div className="carousel-viewport">
        <div
          className={`carousel-track d-flex ${
            !showDesktopControls && !isMobileView
              ? "justify-content-center"
              : ""
          }`}
          ref={trackRef}
          style={{
            transform:
              showDesktopControls || isMobileView ? transformValue : "none",
          }}
        >
          {items.map((item, index) => (
            <div className="carousel-card" key={index}>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="card-footer">
                <div className="threats-container">
                  {item.threats?.map((threat, i) => (
                    <div
                      key={i}
                      className="rectangle-good-practice rectangle-blue"
                    >
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
            </div>
          ))}
        </div>
      </div>

      {showDots && (
        <div className="carousel-dots">
          {Array.from({ length: dotCount }).map((_, index) => (
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
