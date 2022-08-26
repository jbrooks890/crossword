import { useState } from "react";
import Frame from "../Frame";
import NewPuzzleForm from "../shared/NewPuzzleForm";

export default function Build() {
  const [newPuzzle, setNewPuzzle] = useState({
    name: "",
    type: "Crossword",
    gridSize: [20, 20],
    version: 1,
    answerKey: {},
    answers: {},
  });
  const [editorMode, setEditorMode] = useState(false);
  const [grid, setGrid] = useState([]);
  const [phase, setPhase] = useState(0);

  const updatePuzzle = e => {
    const { name, value } = e.target;
    setNewPuzzle(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => setPhase(prev => prev + 1);

  return (
    <div id="build-page">
      <h2>Build</h2>
      {phase === 0 && (
        <NewPuzzleForm
          puzzle={newPuzzle}
          updatePuzzle={e => updatePuzzle(e)}
          handleSubmit={handleSubmit}
        />
      )}
      {/* {phase > 0 && <Frame puzzle={newPuzzle} editorMode={true} />} */}
      {phase > 0 && <h1>MAKE A PUZZLE!</h1>}
    </div>
  );
}
