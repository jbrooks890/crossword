import { useState, useEffect, useCallback } from "react";
import { getLetter } from "../services/customHooks";

export default function Cell({ cell_name: id, index, editorMode, ...props }) {
  const {
    isJunction,
    answer,
    groups,
    display,
    crop,
    controls,
    hoverGroup,
    focusCell,
    axis,
    toggleAxis,
    operations,
    updateGrid,
  } = props;

  // const [axis, toggleAxis] = useState(true); // TRUE = across, FALSE = down
  // const [focused, setFocused] = useState(false);

  // useEffect(() => setFocused(true), []);
  // const toggleFocus = useCallback(() => setFocused(prev => !prev), []);

  const axisGroups = new Map(); // TODO
  !editorMode &&
    groups.forEach(group => axisGroups.set(group.split("-")[0], group)); // TODO

  // =========== EDITOR CONTROLS ===========
  const editControls = e => {
    const {
      type,
      key,
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

    switch (type) {
      // ++++++ KEY UP ++++++
      case "keyup":
        printable && toNext();
        break;
      // ++++++ KEY DOWN ++++++
      case "keydown":
        // console.log(key);
        switch (key) {
          case " ":
            e.preventDefault();
            toggleAxis(prev => !prev);
            break;
          case "Backspace":
            // const { group } = answers[activeGroup];
            if (content.length < 1) {
              // const prev = group.indexOf(id) - 1;
              // if (prev < 0) {
              //   input.blur();
              // } else {
              //   focusCell(group[prev]);
              // }
            }
            break;
          case "ArrowLeft":
            e.preventDefault();
            navTo(index, [-1, 0]);
            // shiftKey
            //   ? focusFirst(activeGroup, true)
            //   : focusNearest(id, index, [-1, 0]);

            break;
          case "ArrowRight":
            e.preventDefault();
            navTo(index, [1, 0]);
            // focusNearest(id, index, [1, 0]);
            break;
          case "ArrowUp":
            e.preventDefault();
            navTo(index, [0, -1]);
            // shiftKey
            //   ? focusFirst(activeGroup, true)
            //   : focusNearest(id, index, [0, -1]);
            break;
          case "ArrowDown":
            e.preventDefault();
            navTo(index, [0, 1]);
            // focusNearest(id, index, [0, 1]);
            break;
        }
        break;
    }
  };

  // =========== TO NEXT ===========
  const toNext = () => {
    // console.log(index);
    const [x, y] = index;
    const next = axis ? getLetter(x + 1) + y : getLetter(x) + (y + 1);
    // console.log(`%c${id} --> ${next}`, "color: aquamarine");
    // console.log(document.getElementById(next));
    document.querySelector(`.${next}.cell-input`).focus();
  };

  // =========== TO CELL ===========
  const navTo = (index, diff) => {
    //DIFF = [x,y]
    const [x, y] = index;
    const [a, b] = diff;
    const destination = getLetter(x + a) + (y + b);
    document.querySelector(`.${destination}.cell-input`).focus();
  };

  // =========== FORMAT CELL ===========

  const formatCell = () => {
    const axisGroups = new Map();
    groups.forEach(group => axisGroups.set(group.split("-")[0], group));

    return {
      cell: {
        classes: formatClassList(
          [
            answer && "show",
            groups.length && groups.join(" "),
            isJunction && "junction",
            axisGroups.has("across") && "across",
            axisGroups.has("down") && "down",
            display && display.join(" "),
            crop && "crop ",
          ].filter(entry => entry)
        ),
        attributes: {
          ["data-groups"]: groups.join(" "),
          onMouseEnter: () =>
            axisGroups.forEach((group, dir) => hoverGroup(group, dir)),
          onMouseLeave: () =>
            axisGroups.forEach((group, dir) => hoverGroup(group, dir)),
        },
      },
      input: {
        attributes: {
          onClick: () => focusCell(id, !isJunction ? groups[0] : undefined),
          onKeyDown: e => controls(e),
          onKeyUp: e => controls(e),
        },
      },
    };
  };

  const AxisBox = ({ dir }) => (
    <span
      className={formatClassList([
        `${dir}Box`,
        "axis-box",
        axisGroups.has(dir) && axisGroups.get(dir),
      ])}
      onFocus={e => document.querySelector(`#${id} .cell-input`).focus()}
    ></span>
  );

  const AxisSelector = () => (
    <div className="axis-select">
      {groups.map((group, i) => {
        const dir = group.split("-")[0];
        return (
          <button
            key={i}
            className={`select-${dir}`}
            onClick={e => {
              e.preventDefault();
              focusCell(id, axisGroups.get(dir));
            }}
          ></button>
        );
      })}
    </div>
  );

  const formatClassList = classArr =>
    classArr
      .filter(entry => entry)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

  // id === "H2" && console.log(formatCell());

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::
  return (
    <div
      id={id}
      className={
        editorMode
          ? // ? `cell build ${focused ? 'focused' : ''} ${axis ? "edit-across" : "edit-down"}`
            formatClassList([
              "cell",
              "build",
              // focused && "focused",
              axis ? "edit-across" : "edit-down",
            ])
          : `cell ${formatCell().cell.classes}`
      }
      data-coord-x={index[0]}
      data-coord-y={index[1]}
      {...(!editorMode && formatCell().cell.attributes)}
    >
      {["across", "down"].map((dir, i) => (
        <span
          key={i}
          className={formatClassList([
            `${dir}Box`,
            "axis-box",
            axisGroups.has(dir) && axisGroups.get(dir),
          ])}
          onFocus={e => document.querySelector(`#${id} .cell-input`).focus()}
        ></span>
      ))}
      {!editorMode && isJunction && <AxisSelector />}
      <input
        className={`cell-input ${id} ${answer ? "show" : null}`}
        type="text"
        size="1"
        maxLength="1"
        tabIndex="-1"
        onFocus={e => {
          // toggleFocus();
          e.currentTarget.select();
        }}
        onChange={updateGrid} // UPDATE GRID + FIND GROUPS
        // onBlur={toggleFocus()}
        onClick={() => {
          !editorMode && focusCell(id, !isJunction ? groups[0] : undefined);
          // focusCell(id, !isJunction ? groups[0] : undefined);
        }}
        onKeyDown={e => (editorMode ? editControls(e) : controls(e))}
        // onKeyDown={e => controls(e)}
        onKeyUp={e => (editorMode ? editControls(e) : controls(e))}
        placeholder={editorMode ? id : undefined}
      />
    </div>
  );
}
