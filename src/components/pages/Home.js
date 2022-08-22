import { useState, useEffect } from "react";
import Frame from "../Frame";
import testPuzzle from "../../services/test-puzzles";

export default function Home() {
  // useEffect(() => setActivePuzzle(testPuzzle), []);
  const [activePuzzle, setActivePuzzle] = useState(testPuzzle);
  const [game, setGame] = useState({
    user: "",
    input: { ...activePuzzle.answerKey },
    assists: [],
    startTime: 0, // Date obj
    timer: 0,
    completed: false,
  });

  return (
    <div id="home-page">
      <h1 className="puzzle-title">{activePuzzle.name}</h1>
      <Frame puzzle={activePuzzle} />
    </div>
  );
}
