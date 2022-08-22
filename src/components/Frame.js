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

  const setGroup = name => {
    if (answers[name])
      document
        .querySelectorAll(".axis-box.active")
        .forEach(cell => cell.classList.remove("active"));

    document
      .querySelectorAll(`.axis-box.${name}`)
      .forEach(cell => cell.classList.add("active"));

    setActiveGroup(answers[name]);
  };

  const keyUp = e => {
    console.log(e);
    const press = e.key;
    const cell = e.currentTarget;
    const id = cell.parentElement.id;
    const content = e.currentTarget.value;

    focusNext(id);
  };

  const keyDown = e => {
    console.log(e);
    const press = e.key;
    const cell = e.currentTarget;
    const id = cell.parentElement.id;

    switch (press) {
      case "Tab":
        e.preventDefault();
        focusNext(id);
        break;
    }
  };

  const buttonControls = e => {
    console.log(e);
    const type = e.type;
    const press = e.key;
    const cell = e.currentTarget;
    const id = cell.parentElement.id;
    const content = e.currentTarget.value;

    console.log({ press, type });

    switch (type) {
      case "keyup":
        focusNext(id);
        break;
      case "keydown":
        switch (press) {
          case "Tab":
            e.preventDefault();
            focusNext(id);
            break;
          case "Backspace":
            alert("Go backwards!");
            break;
        }
        break;
    }
  };

  const focusNext = id => {
    const { group } = activeGroup;
    const currPos = group.indexOf(id);
    // const isFirst = currPos === 0;
    const isLast = currPos === group.length - 1;
    let nextPos;
    if (!isLast) {
      nextPos = group[currPos + 1];
    }
    console.log(`${id} --> ${nextPos}`);
    document.querySelector(`#${nextPos} .cell-input`).focus();
  };

  // console.log(answers);

  return (
    <form id="crossword">
      <HintBox hint={activeGroup.hint} />
      <Grid
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        editorMode={editorMode}
        answerKey={answerKey}
        answers={answers}
        cellClick={setGroup}
        cellKeyDown={e => keyDown(e)}
        controls={e => buttonControls(e)}
      />
      {/* <HintCache hints={answers.map(answer => answer.hint)} /> */}
      <ButtonCache />
    </form>
  );
}
