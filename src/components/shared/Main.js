import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import About from "../pages/About";
import Build from "../pages/Build";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Play from "../pages/Play";
import axios from "axios";
import apiUrl from "../../config";

export default function Main() {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/puzzles`);
      setGames(response.data.puzzles);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => fetchData(), []);

  return (
    <main>
      <Routes>
        <Route path="/" element={<Home games={games} />} />
        <Route path="/puzzles/:id" element={<Play games={games} />} />
        <Route path="/build" element={<Build />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}
