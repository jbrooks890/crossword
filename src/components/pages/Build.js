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
    cols: 10,
    rows: 10,
    version: 1,
    editorMode: { active: true, phase: 0 },
    answerKey: {},
    answers: [],
    tags: [],
  });
  const sectionTabs = ["Grid", "Hints", "Preview"];
  const [activeSection, setActiveSection] = useState(0);
  const { phase } = newPuzzle.editorMode;

  // console.log(grid);
  useEffect(() => console.log(newPuzzle), [activeSection, newPuzzle.answerKey]);
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

  const updatePuzzleGroups = (answer, $answers) => {
    console.log(`%cRUNNING UPDATE PUZZLE GROUPS`, "color: yellow");
    const answers = new Map($answers.map(answer => [answer.name, answer]));
    // console.log(`%c${answers.size}`, "color:lime");
    // console.log(answer);

    setNewPuzzle(prev => ({
      ...prev,
      answerKey: { ...prev.answerKey, ...answer },
      answers,
      editorMode: {
        ...prev.editorMode,
        phase: answers.size ? 2 : 1,
      },
    }));
  };

  // ============ UPDATE ANSWERS ============

  const updateAnswerKey = (e, id, $answers) => {
    const { value } = e.target;
    if (value.length) {
      console.log(`%cTEST`, "color:red");
      setNewPuzzle(prev => ({
        ...prev,
        answerKey: { ...prev.answerKey, [id]: value.toUpperCase() },
      }));
    }
  };

  // =========== NEW PUZZLE SUBMIT ===========

  const newPuzzleSubmit = e => {
    e.preventDefault();
    setNewPuzzle(prev => ({
      ...prev,
      editorMode: { ...prev.editorMode, phase: 1 },
    }));
  };

  // -------------------------------------------------
  // <><><><><><><><> CELL OPERATIONS <><><><><><><><>
  // -------------------------------------------------

  // =========== CONTROLS ===========
  // const editControls = e => {
  //   const {
  //     type,
  //     key,
  //     altKey,
  //     ctrlKey,
  //     shiftKey,
  //     currentTarget: input,
  //     which,
  //   } = e;
  //   const { parentElement: cell } = input;
  //   const { id } = cell;
  //   const content = input.value;
  //   const printable = which >= 65 && which <= 90;

  //   switch (type) {
  //     // ++++++ KEY UP ++++++
  //     case "keyup":
  //       printable && toNext();
  //       break;
  //     // ++++++ KEY DOWN ++++++
  //     case "keydown":
  //       // console.log(key);
  //       switch (key) {
  //         case " ":
  //           e.preventDefault();
  //           toggleAxis(prev => !prev);
  //           break;
  //         case "Backspace":
  //           if (content.length < 1) {
  //           }
  //           break;
  //         case "ArrowLeft":
  //           e.preventDefault();
  //           navTo(index, [-1, 0]);
  //           break;
  //         case "ArrowRight":
  //           e.preventDefault();
  //           navTo(index, [1, 0]);
  //           break;
  //         case "ArrowUp":
  //           e.preventDefault();
  //           navTo(index, [0, -1]);
  //           break;
  //         case "ArrowDown":
  //           e.preventDefault();
  //           navTo(index, [0, 1]);
  //           break;
  //       }
  //       break;
  //   }
  // };

  // =========== TO NEXT ===========
  // const toNext = () => {
  //   const [x, y] = index;
  //   const next = axis ? getLetter(x + 1) + y : getLetter(x) + (y + 1);
  //   document.querySelector(`.${next}.cell-input`).focus();
  // };

  // =========== TO CELL ===========
  // const navTo = (index, diff) => {
  //   //DIFF = [x,y]
  //   const [x, y] = index;
  //   const [a, b] = diff;
  //   const destination = getLetter(x + a) + (y + b);
  //   document.querySelector(`.${destination}.cell-input`).focus();
  // };

  // console.log(`%c${activeSection}`, "color: lime");
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
          <BuildNav
            sections={sectionTabs}
            active={activeSection}
            changeSection={setActiveSection}
          />
          <Grid
            puzzle={newPuzzle}
            active={activeSection === 0 || activeSection === 2}
            preview={activeSection === 2}
            updatePuzzleGroups={updatePuzzleGroups}
            updateAnswerKey={updateAnswerKey}
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
