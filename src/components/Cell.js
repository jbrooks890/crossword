import { useState, useEffect } from "react";

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
  } = props;

  const [editAxis, setEditAxis] = useState("across");

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
    switch (type) {
      // ++++++ KEY UP ++++++
      case "keyup":
        // printable && focusNext(id);
        break;
      // ++++++ KEY DOWN ++++++
      case "keydown":
        switch (key) {
          case " ":
            e.preventDefault();
            break;
        }
        break;
    }
  };

  // =========== HANDLE SUBMIT ===========

  const formatCell = () => {
    const axisGroups = new Map();
    groups.forEach(group => axisGroups.set(group.split("-")[0], group));

    return {
      cell: {
        classes: [
          answer && "show",
          groups.length && groups.join(" "),
          isJunction && "junction",
          axisGroups.has("across") && "across",
          axisGroups.has("down") && "down",
          display && display.join(" "),
          crop && "crop ",
        ].filter(entry => entry),
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
          ? "cell build"
          : formatClassList(["cell", ...formatCell().cell.classes])
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
        onFocus={e => e.currentTarget.select()}
        onClick={() => {
          !editorMode && focusCell(id, !isJunction ? groups[0] : undefined);
          // focusCell(id, !isJunction ? groups[0] : undefined);
        }}
        onKeyDown={e => controls(e)}
        onKeyUp={e => controls(e)}
        placeholder={editorMode ? id : undefined}
      />
    </div>
  );
}
