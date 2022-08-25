import { useState, useEffect, createContext } from "react";
import ButtonCache from "./ButtonCache";
import Grid from "./Grid";
import HintBox from "./HintBox";
import HintCache from "./HintCache";

const ActiveGroup = createContext();

export default function Frame({ puzzle }) {
  const [editorMode, setEditorMode] = useState(false);
  const [gridWidth, gridHeight] = puzzle.gridSize;
  const { answerKey, answers } = puzzle;
  const [activeGroup, setActiveGroup] = useState(Object.keys(answers)[0]);

  // useEffect(() => console.log(Object.keys(answers)), []);
  useEffect(() => console.log(`%c${"=".repeat(50)}`, "color: orange"), []);
  useEffect(
    () =>
      console.log(`%c${activeGroup}`, "color: lime; text-transform: uppercase"),
    [activeGroup]
  );

  // =========== FOCUS CELL ===========
  const focusCell = (id, group = activeGroup) => {
    console.log("running focus cell", { id, group });
    group !== activeGroup && setGroup(group);
    document.querySelector(`#${id} .cell-input`).focus();
  };

  // =========== SET GROUP ===========
  // const setGroup = (name, groups = [name], swap = false) => {
  const setGroup = name => {
    // console.log("Groups:", groups);

    console.log({ name });
    if (name !== activeGroup) {
      // const name = groups.find(name => name !== activeGroup);
      console.log(`Change groups: ${activeGroup} --> ${name}`);

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
    }
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
            const { group } = answers[activeGroup];
            if (content.length < 1) {
              const prev = group.indexOf(id) - 1;

              if (prev < 0) {
                cell.blur();
              } else {
                focusCell(group[prev]);
              }
            }
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
    // const getCell = id => document.querySelector(`#${id} .cell-input`);
    let nextPos;

    if (!lastCell) {
      // nextPos = group[currPos + 1];
      focusCell(group[currPos + 1]);
    } else {
      if (isJunction) {
        const altGroupName = cell
          .getAttribute("data-groups")
          .split(" ")
          .find(name => name !== activeGroup);
        const altGroup = answers[altGroupName].group;

        let next = altGroup.indexOf(id) + 1;
        focusCell(altGroup[next], altGroupName);
      } else {
        focusNextGroup();
      }
    }
    // nextPos && focusCell(nextPos);
  };

  // =========== FOCUS NEXT GROUP ===========
  const focusNextGroup = (name = activeGroup) => {
    console.log("running focus next group");
    const groups = Object.keys(answers);
    const index = groups.indexOf(name);
    let next = index + 1 >= groups.length ? groups[0] : groups[index + 1];

    console.log(`Group: ${index + 1}/${groups.length}`);
    console.log({ next });
    focusFirst(next);
  };

  // =========== FOCUS FIRST ===========
  const focusFirst = name => {
    const { group } = answers[name];
    const targets = group.filter(
      id => document.querySelector(`#${id} .cell-input`).value.length === 0
    );

    targets.length ? focusCell(targets[0], name) : focusNextGroup(name);
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
        activeGroup={activeGroup}
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        editorMode={editorMode}
        answerKey={answerKey}
        answers={answers}
        setGroup={setGroup}
        controls={e => buttonControls(e)}
        onHover={hoverGroup}
        focusCell={focusCell}
      />
      <HintCache hints={getHints()} onClick={setGroup} onHover={hoverGroup} />
      <ButtonCache />
    </form>
  );
}
