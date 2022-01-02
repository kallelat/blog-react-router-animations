import React from "react";
import { BrowserRouter } from "react-router-dom";
import Slideshow from "./components/slideshow";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* BrowserRouter is a special case of normal Router, see https://reactrouter.com/docs/en/v6/api#browserrouter */}
      <BrowserRouter>
        <Slideshow />
      </BrowserRouter>
    </div>
  );
}

export default App;
