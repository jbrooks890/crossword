import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import About from "../pages/About";
import Build from "../pages/Build";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

export default function Main() {
  // TODO: STATE = CURRENT PUZZLE
  // TODO: STATE = NEW PUZZLE

  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build" element={<Build />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}
