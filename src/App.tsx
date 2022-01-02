import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Slide from "./components/slide";

function App() {
  return (
    <div className="App">
      {/* BrowserRouter is a special case of normal Router, see https://reactrouter.com/docs/en/v6/api#browserrouter */}
      <BrowserRouter>
        <Routes>
          {/* redirect root to first slide */}
          <Route path="/" element={<Navigate replace to="/slides/1" />} />

          {/* a dynamic route to handle all the slides */}
          <Route path="/slides/:number" element={<Slide />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
