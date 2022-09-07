import { useEffect, useState } from "react";
import BuildNav from "../BuildNav";
import Frame from "../Frame";
import Grid from "../Grid";
import NewPuzzleForm from "../shared/NewPuzzleForm";

export default function Build() {
  const [newPuzzle, setNewPuzzle] = useState({
    name: "Boogie",
    type: "Crossword",
    cols: 20,
    rows: 20,
    version: 1,
    editorMode: { active: true, phase: 0 },
    answerKey: {},
    answers: {},
  });
  const { phase } = newPuzzle.editorMode;

  // console.log(grid);
  // console.log(newPuzzle);

  // =========== UPDATE PUZZLE ===========

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

  // =========== UPDATE PUZZLE GROUPS ===========

  const updatePuzzleGroups = () => {
    setNewPuzzle(prev => ({
      ...prev,
    }));
  };

  // =========== NEW PUZZLE SUBMIT ===========

  const newPuzzleSubmit = e => {
    e.preventDefault();
    setNewPuzzle(prev => ({
      ...prev,
      editorMode: { ...prev.editorMode, phase: phase + 1 },
    }));
  };

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div id="build-page">
      {phase === 0 && (
        <NewPuzzleForm
          puzzle={newPuzzle}
          updatePuzzle={e => updatePuzzle(e)}
          newPuzzleSubmit={newPuzzleSubmit}
        />
      )}
      {phase > 0 && (
        <Frame puzzle={newPuzzle}>
          <BuildNav />
          <Grid puzzle={newPuzzle} updatePuzzleGroups={updatePuzzleGroups} />
        </Frame>
      )}
    </div>
  );
}
