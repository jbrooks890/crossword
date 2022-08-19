import { useState, useEffect } from "react";
import Frame from "../Frame";
import testPuzzle from "../../services/test-puzzles";

export default function Home() {
  const [activePuzzle, setActivePuzzle] = useState({
    name: "Test",
    gridSize: [20, 20],
    answerKey: {},
    answers: {},
  });
  const [game, setGame] = useState({
    user: "",
    assists: [],
    startTime: 0, // Date obj
    timer: 0,
    completed: false,
  });

  useEffect(() => setActivePuzzle(testPuzzle), []);

  // console.log(testPuzzle);

  return (
    <div id="home-page">
      <h1 className="puzzle-title">{activePuzzle.name}</h1>
      <Frame puzzle={activePuzzle} />
    </div>
  );
}
