import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Slide, { Direction } from "./slide";
import "./slideshow.css";

const Slideshow = () => {
  const location = useLocation();
  const [direction, toggleDirection] = useState<Direction>("right");

  return (
    <TransitionGroup className="slideshow">
      <CSSTransition key={location.pathname} classNames="slide" timeout={1000}>
        <Routes location={location}>
          {/* redirect root to first slide */}
          <Route path="/" element={<Navigate replace to="/slides/1" />} />

          {/* a dynamic route to handle all the slides */}
          <Route
            path="/slides/:number"
            element={<Slide onChange={toggleDirection} direction={direction} />}
          />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Slideshow;
