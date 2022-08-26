import { useState, useEffect } from "react";

export default function Cell({
  cell_name: id,
  isJunction,
  index,
  answer,
  groups,
  display,
  crop,
  controls,
  onHover,
  focusCell,
}) {
  const axisGroups = new Map();

  groups.forEach(group => axisGroups.set(group.split("-")[0], group));

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div
      id={id}
      className={[
        "cell",
        answer ? "show" : null,
        groups.length ? groups.join(" ") : null,
        isJunction ? "junction" : null,
        axisGroups.has("across") ? "across" : null,
        axisGroups.has("down") ? "down" : null,
        display ? display.join(" ") : null,
        crop ? "crop " : null,
      ]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()}
      data-groups={groups.join(" ")}
      data-coord-x={index[0]}
      data-coord-y={index[1]}
      onMouseEnter={() =>
        axisGroups.forEach((group, dir) => onHover(group, dir))
      }
      onMouseLeave={() =>
        axisGroups.forEach((group, dir) => onHover(group, dir))
      }
    >
      <span
        className={`acrossBox axis-box ${
          axisGroups.has("across") ? axisGroups.get("across") : ""
        }`}
        onFocus={e => document.querySelector(`#${id} .cell-input`).focus()}
      ></span>
      <span
        className={`downBox axis-box ${
          axisGroups.has("down") ? axisGroups.get("down") : ""
        }`}
        onFocus={e => document.querySelector(`#${id} .cell-input`).focus()}
      ></span>
      {isJunction && (
        // ====== AXIS SELECTOR BOX ======
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
      )}
      <input
        className={`cell-input ${id} ${answer ? "show" : null}`}
        type="text"
        size="1"
        maxLength="1"
        tabIndex="-1"
        onFocus={e => e.currentTarget.select()}
        onClick={() => focusCell(id, !isJunction ? groups[0] : undefined)}
        onKeyDown={e => controls(e)}
        onKeyUp={e => controls(e)}
        // placeholder={id}
      />
    </div>
  );
}
