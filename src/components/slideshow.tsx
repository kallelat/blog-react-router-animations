import { Routes, Route, Navigate } from "react-router-dom";
import Slide from "./slide";

const Slideshow = () => {
  return (
    <Routes>
      {/* redirect root to first slide */}
      <Route path="/" element={<Navigate replace to="/slides/1" />} />

      {/* a dynamic route to handle all the slides */}
      <Route path="/slides/:number" element={<Slide />} />
    </Routes>
  );
};

export default Slideshow;