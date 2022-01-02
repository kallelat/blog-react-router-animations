import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./slide.css";

// a generic Slide component to implement navigation and layout for a single slide
const Slide = () => {
  // navigate hook to enabled navigation
  const navigate = useNavigate();

  // get slide number from url parameters
  const urlParams = useParams();
  const { number = "" } = urlParams;
  const currentSlide = parseInt(number, 10) || 1; // default to 1

  // an utility function to trigger navigation
  const gotoSlide = (toSlide: number) => {
    navigate(`/slides/${toSlide}`);
  };

  return (
    <div className="slide">
      {/* a button to go to previous slide */}
      <button
        disabled={currentSlide === 1}
        className="nav previous"
        onClick={() => gotoSlide(currentSlide - 1)}
      >
        previous
      </button>

      {/* display slide contents */}
      <div className="content">Slide #{number}</div>

      {/* a button to go to next slide */}
      <button
        disabled={currentSlide === 100}
        className="nav next"
        onClick={() => gotoSlide(currentSlide + 1)}
      >
        next
      </button>
    </div>
  );
};

export default Slide;
