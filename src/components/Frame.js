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
  // const [history, setHistory] = useState([]);

  useEffect(() => console.log(`%c${"=".repeat(50)}`, "color: orange"), []);
  useEffect(
    () =>
      console.log(`%c${activeGroup}`, "color: lime; text-transform: uppercase"),
    [activeGroup]
  );

  // =========== GET CELL DATA ===========
  const cellData = id => {
    const element = document.getElementById(id);
    const input = element.querySelector(".cell-input");
    const groups = element.getAttribute("data-groups").split(" ");
    const isJunction = element.classList.contains("junction");
    const x = parseInt(element.getAttribute("data-coord-x"));
    const y = parseInt(element.getAttribute("data-coord-y"));
    const direction = isJunction ? "junction" : groups[0].split("-")[0];
    return { id, element, input, groups, isJunction, x, y, direction };
  };

  // =========== FOCUS CELL ===========
  const focusCell = (id, group = activeGroup) => {
    group !== activeGroup && setGroup(group);
    cellData(id).input.focus();
  };

  // =========== SET GROUP ===========
  const setGroup = name => {
    if (name !== activeGroup) {
      // console.log(`Change groups: ${activeGroup} --> ${name}`);

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
      currentTarget: input,
      which,
    } = e;
    const { parentElement: cell } = input;
    const { id } = cell;
    const content = input.value;
    const printable = which >= 65 && which <= 90;
    const isJunction = document
      .getElementById(id)
      .classList.contains("junction");
    const index = [
      parseInt(cell.getAttribute("data-coord-x")),
      parseInt(cell.getAttribute("data-coord-y")),
    ];
    const groups = cell.getAttribute("data-groups").split(" ");

    // console.log({ e, press, type });
    // console.log(index);

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
                input.blur();
              } else {
                focusCell(group[prev]);
              }
            }
            break;
          case "Enter":
            e.preventDefault();
            focusNextGroup();
            break;
          case " ": // SPACE BAR
            e.preventDefault();
            if (isJunction) {
              focusCell(
                id,
                groups.find(group => group !== activeGroup)
              );
            }
            break;
          case "ArrowLeft":
            e.preventDefault();
            focusNearest(id, index, [-1, 0]);
            break;
          case "ArrowRight":
            e.preventDefault();
            focusNearest(id, index, [1, 0]);
            break;
          case "ArrowUp":
            e.preventDefault();
            focusNearest(id, index, [0, -1]);
            break;
          case "ArrowDown":
            e.preventDefault();
            focusNearest(id, index, [0, 1]);
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
  const focusFirst = (name, strict = false) => {
    const { group } = answers[name];
    const targets = group.filter(
      id => document.querySelector(`#${id} .cell-input`).value.length === 0
    );

    targets.length
      ? focusCell(strict ? group[0] : targets[0], name)
      : focusNextGroup(name);
  };

  // =========== GET LETTER ===========
  const getLetter = n => {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    // console.log(String.fromCharCode(first + n - 1));
    return String.fromCharCode(first + n).toUpperCase();
  };

  // =========== FOCUS NEAREST ===========
  const focusNearest = (id, [x, y], [xDiff, yDiff]) => {
    const cell = document.getElementById(id);
    const actives = Object.keys(answerKey);
    let cols = [];
    let rows = [];
    actives.forEach(entry => {
      const [col, _row] = entry.match(/[\d\.]+|\D+/g);
      const row = parseInt(_row);
      !cols.includes(col) && cols.push(col);
      !rows.includes(row) && rows.push(parseInt(row));
    });

    // AXIS: checking for candidates along an 'axis'
    const [dir, axis] =
      Math.abs(xDiff) > Math.abs(yDiff) ? ["across", cols] : ["down", rows];

    let destination;

    for (let distance = 1; distance < axis.length; distance++) {
      const [destX, destY] = [x + xDiff * distance, y + yDiff * distance];
      const candidate = getLetter(destX) + destY;

      if (
        destX < 0 ||
        destY < 0 ||
        destX >= axis.length ||
        destY >= axis.length
      )
        break;
      if (answerKey[candidate]) {
        destination = candidate;
        break;
      }
    }

    if (destination) {
      const cell = document.getElementById(destination);
      const isJunction = cell.classList.contains("junction");
      const groups = cell.getAttribute("data-groups").split(" ");
      const group = isJunction
        ? groups.find(group => group.includes(dir))
        : groups[0];
      focusCell(destination, group);
    }
  };

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
        getLetter={getLetter}
      />
      <HintCache hints={getHints()} onClick={focusFirst} onHover={hoverGroup} />
      <ButtonCache />
    </form>
  );
}
