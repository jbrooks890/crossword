import { useEffect, useState } from "react";
import BuildNav from "../BuildNav";
import Frame from "../Frame";
import Grid from "../Grid";
import HintInput from "../HintInput";
import NewPuzzleForm from "../shared/NewPuzzleForm";

export default function Build() {
  const [newPuzzle, setNewPuzzle] = useState({
    name: "Boogie",
    type: "Crossword",
    description: "",
    cols: 20,
    rows: 20,
    version: 1,
    editorMode: { active: true, phase: 0 },
    answerKey: {},
    answers: {},
    tags: [],
  });
  const sectionTabs = ["Grid", "Hints", "Preview"];
  const [activeSection, setActiveSection] = useState(0);
  const { phase } = newPuzzle.editorMode;

  // console.log(grid);
  useEffect(() => console.log(newPuzzle), [activeSection]);

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

  const updatePuzzleGroups = (answerKey, answers) => {
    // console.log(`%cRUNNING UPDATE PUZZLE GROUPS`, "color: orange");

    setNewPuzzle(prev => ({
      ...prev,
      answerKey,
      answers,
      editorMode: {
        ...prev.editorMode,
        phase: Object.keys(answers).length ? 2 : 1,
      },
    }));
  };

  // =========== NEW PUZZLE SUBMIT ===========

  const newPuzzleSubmit = e => {
    e.preventDefault();
    setNewPuzzle(prev => ({
      ...prev,
      editorMode: { ...prev.editorMode, phase: 1 },
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
          <BuildNav sections={sectionTabs} changeSection={setActiveSection} />
          <Grid
            puzzle={newPuzzle}
            active={activeSection === 0 || activeSection === 2}
            preview={activeSection === 2}
            updatePuzzleGroups={updatePuzzleGroups}
          />
          {phase === 2 && (
            <HintInput
              active={activeSection === 1}
              groups={newPuzzle.answers}
            />
          )}
        </Frame>
      )}
    </div>
  );
}
