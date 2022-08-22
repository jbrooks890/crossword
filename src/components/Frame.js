import { useState, useEffect } from "react";
import ButtonCache from "./ButtonCache";
import Grid from "./Grid";
import HintBox from "./HintBox";
import HintCache from "./HintCache";

export default function Frame({ puzzle }) {
  const [editorMode, setEditorMode] = useState(false);
  const [gridWidth, gridHeight] = puzzle.gridSize;
  const [activeGroup, setActiveGroup] = useState("");
  const { answerKey, answers } = puzzle;

  // =========== SET GROUP ===========
  const setGroup = (name, focusFirst = false) => {
    if (answers[name]) {
      document
        .querySelectorAll(".active")
        .forEach(cell => cell.classList.remove("active"));
    }
    document
      .querySelectorAll(`.axis-box.${name}`)
      .forEach(cell => cell.classList.add("active"));
    document.querySelector(`#hint-${name}`).classList.add("active");

    setActiveGroup(name);
    focusFirst &&
      document.querySelector(`#${answers[name].group[0]} .cell-input`).focus();
  };

  // =========== BUTTON CONTROLS ===========
  const buttonControls = e => {
    // console.log(e);
    const type = e.type;
    const press = e.key;
    const cell = e.currentTarget;
    const id = cell.parentElement.id;
    const content = e.currentTarget.value;
    const printable = e.which >= 65 && e.which <= 90;

    // console.log({ press, type });

    switch (type) {
      // ++++++ KEY UP ++++++
      case "keyup":
        printable && focusNext(id);
        break;
      // ++++++ KEY DOWN ++++++
      case "keydown":
        switch (press) {
          case "Tab":
            e.preventDefault();
            focusNext(id);
            break;
          case "Backspace":
            // console.log(activeGroup);
            const { group } = answers[activeGroup];
            if (content.length < 1) {
              const prev = group.indexOf(id) - 1;

              if (prev < 0) {
                cell.blur();
              } else {
                document.querySelector(`#${group[prev]} .cell-input`).focus();
              }
            }
            // alert("Go backwards!");
            break;
          case "Enter":
            focusNextGroup();
            break;
        }
        break;
    }
  };

  // =========== FOCUS NEXT ===========
  const focusNext = id => {
    const cell = document.getElementById(id);
    const { group } = answers[activeGroup];
    const currPos = group.indexOf(id);
    // const isFirst = currPos === 0;
    const lastCell = currPos === group.length - 1;
    const isJunction = cell.classList.contains("junction");
    const getCell = id => document.querySelector(`#${id} .cell-input`);
    let nextPos;

    if (!lastCell) {
      nextPos = group[currPos + 1];
    } else {
      if (isJunction) {
        const altGroupName = cell
          .getAttribute("data-groups")
          .split(" ")
          .find(name => name != activeGroup);
        const altGroup = answers[altGroupName].group;

        let next = altGroup.indexOf(id) + 1;
        nextPos = altGroup[next];
      } else {
        focusNextGroup();
      }
    }
    nextPos && document.querySelector(`#${nextPos} .cell-input`).focus();
  };

  // =========== FOCUS NEXT GROUP ===========
  const focusNextGroup = () => {
    const groups = Object.keys(answers);
    const index = groups.indexOf(activeGroup);
    let next = index + 1 >= groups.length ? groups[0] : groups[index + 1];
    setGroup(next, true);
  };

  // console.log(answers);
  const getHints = () => {
    let list = new Map();
    Object.keys(answers).forEach(entry => list.set(entry, answers[entry].hint));
    // console.log(list);
    return list;
  };

  return (
    <form id="crossword">
      <HintBox hint={answers[activeGroup].hint} />
      <Grid
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        editorMode={editorMode}
        answerKey={answerKey}
        answers={answers}
        setGroup={setGroup}
        // cellKeyDown={e => keyDown(e)}
        controls={e => buttonControls(e)}
      />
      <HintCache hints={getHints()} onClick={setGroup} />
      <ButtonCache />
    </form>
  );
}
