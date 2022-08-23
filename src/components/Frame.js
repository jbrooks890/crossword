import { useState, useEffect } from "react";
import ButtonCache from "./ButtonCache";
import Grid from "./Grid";
import HintBox from "./HintBox";
import HintCache from "./HintCache";

export default function Frame({ puzzle }) {
  const [editorMode, setEditorMode] = useState(false);
  const [gridWidth, gridHeight] = puzzle.gridSize;
  const { answerKey, answers } = puzzle;
  const [activeGroup, setActiveGroup] = useState(Object.keys(answers)[0]);

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

    focusFirst &&
      document.querySelector(`#${answers[name].group[0]} .cell-input`).focus();
    setActiveGroup(name);
  };

  // =========== BUTTON CONTROLS ===========
  const buttonControls = e => {
    // console.log(e);
    const {
      type,
      key: press,
      altKey,
      ctrlKey,
      shiftKey,
      currentTarget: cell,
      which,
    } = e;
    const id = cell.parentElement.id;
    const content = cell.value;
    const printable = which >= 65 && which <= 90;
    const isJunction = document
      .getElementById(id)
      .classList.contains("junction");

    // console.log({ e, press, type });

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
            e.preventDefault();
            focusNextGroup();
            break;
          case " ":
            e.preventDefault();
            isJunction && console.log("toggle direction");
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
          .find(name => name !== activeGroup);
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
    // console.log("running focus next group");
    const groups = Object.keys(answers);
    const index = groups.indexOf(activeGroup);
    let next = index + 1 >= groups.length ? groups[0] : groups[index + 1];
    setGroup(next, true);
  };

  // =========== FOCUS NEAREST ===========
  const focusNearest = (id, [xDiff, yDiff]) => {};

  // =========== GET HINTS ===========
  const getHints = () => {
    let list = new Map();
    Object.keys(answers).forEach(entry => list.set(entry, answers[entry].hint));
    // console.log(list);
    return list;
  };

  // =========== ON HOVER ===========
  const hoverGroup = (name, direction) => {
    // [...document.querySelectorAll(".preview")].forEach(x =>
    //   x.classList.remove("preview")
    // );

    answers[name].group.forEach(id => {
      const axis = direction === "across" ? ".acrossBox" : ".downBox";
      const cell = document.querySelector(`#${id} ${axis}`);
      cell.classList.toggle("preview");
    });
    document.getElementById("hint-" + name).classList.toggle("preview");
  };

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

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
        controls={e => buttonControls(e)}
        onHover={hoverGroup}
      />
      <HintCache hints={getHints()} onClick={setGroup} onHover={hoverGroup} />
      <ButtonCache />
    </form>
  );
}
