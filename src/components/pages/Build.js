import { useState } from "react";
import Frame from "../Frame";
import NewPuzzleForm from "../shared/NewPuzzleForm";

export default function Build() {
  const [newPuzzle, setNewPuzzle] = useState({
    name: "",
    type: "Crossword",
    cols: 20,
    rows: 20,
    version: 1,
    answerKey: {},
    answers: {},
  });
  const [editorMode, setEditorMode] = useState(false);
  const [grid, setGrid] = useState([]);
  const [phase, setPhase] = useState(0);

  // console.log(newPuzzle);

  const updatePuzzle = e => {
    let { name, value, form } = e.target;
    value =
      name === "name"
        ? value.replace(/\s+/g, " ").trim()
        : name === "rows" || name === "cols"
        ? parseInt(value)
        : value;

    let other = {};
    if (name === "rows" || name === "cols") {
      let dir = name === "rows" ? "cols" : "rows";
      other[dir] = parseInt(form[dir].value);
    }
    // console.log(other);
    setNewPuzzle(prev => ({
      ...prev,
      ...other,
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
      {phase > 0 && <h1>{newPuzzle.name}</h1>}
      {phase > 0 && <Frame puzzle={newPuzzle} editorMode={true} />}
    </div>
  );
}
