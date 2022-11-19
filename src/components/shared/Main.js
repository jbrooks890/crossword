import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import About from "../pages/About";
import Build from "../pages/Build";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Play from "../pages/Play";
import Sandbox from "../pages/Sandbox";
import UserGate from "./UserGate";
import Unauthorized from "../pages/Unauthorized";
import ProtectedContent from "./ProtectedContent";
import Dashboard from "../pages/Dashboard";
import axios from "../../apis/axios";
import useAxios from "../../hooks/useAxios";

export default function Main() {
  const [games, setGames] = useState([]);
  const [response, error, loading, fetch] = useAxios();

  useEffect(
    () =>
      fetch({
        instance: axios,
        method: "GET",
        url: "/puzzles",
      }),
    []
  );

  useEffect(
    () => response?.puzzles?.length && setGames(response.puzzles),
    [fetch]
  );

  return (
    <main>
      <Routes>
        <Route path="/" element={<Home games={games} />} />
        <Route path="/puzzles/:id" element={<Play />} />
        <Route path="/build" element={<Build />} />
        <Route path="/about" element={<About />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/login" element={<UserGate isLogin={true} />} />
        <Route path="/register" element={<UserGate isLogin={false} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedContent allowedRoles={[8737]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}
