import { useState } from "react";

export default function Build() {
  const [newPuzzle, setNewPuzzle] = useState({
    name: "",
    type: "Crossword",
    gridSize: [20, 20],
    version: 1,
    answerKey: {},
    answers: {},
  });
  const [grid, setGrid] = useState([]);
  const [phase, setPhase] = useState(0);

  const drawGrid = () => {
    const [rows, cols] = newPuzzle.gridSize;
    const totalCells = rows * cols;
    let count = 0;

    while (count < totalCells) {}
  };

  return (
    <div id="build-page">
      <h2>Build</h2>
    </div>
  );
}
