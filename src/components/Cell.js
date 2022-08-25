import { useState, useEffect } from "react";

export default function Cell({
  cell_name: id,
  activeGroup,
  isJunction,
  index,
  answer,
  groups,
  display,
  crop,
  setGroup,
  controls,
  onHover,
}) {
  const [axis, setAxis] = useState(
    groups.length && !isJunction
      ? groups[0].split("-")[0]
      : activeGroup.split("-")[0]
  );

  // WHAT SHOULD THE AXIS *DEFAULT* TO IF CELL IS A JUNCTION?

  // id === null && console.log(groups[0].split("-")[0]);

  // let xGroup;
  // let yGroup;
  const axisGroups = new Map();

  // id === "A0" && console.log(id);

  groups.forEach(group => {
    if (group.split("-")[0] === "across") {
      // xGroup = group; // TODO: REMOVE
      axisGroups.set("across", group);
    } else {
      // yGroup = group; // TODO: REMOVE
      axisGroups.set("down", group);
    }
  });

  // =========== SELECT DIRECTION ===========
  const selectDir = async (e, dir) => {
    e.preventDefault();
    const cell = document.getElementById(id);
    const cellInput = cell.querySelector(".cell-input");
    await setAxis(dir);
    cellInput.focus();
  };

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
      ></span>
      <span
        className={`downBox axis-box ${
          axisGroups.has("down") ? axisGroups.get("down") : ""
        }`}
      ></span>
      {isJunction && (
        // ====== AXIS SELECTOR BOX ======
        <div className="axis-select">
          <button
            className="select-across"
            onClick={e => selectDir(e, "across")}
          ></button>
          <button
            className="select-down"
            onClick={e => selectDir(e, "down")}
          ></button>
        </div>
      )}
      <input
        className={`cell-input ${id} ${answer ? "show" : null}`}
        // className={`cell-input`}
        type="text"
        size="1"
        maxLength="1"
        tabIndex="-1"
        onFocus={e => {
          console.log({ axis });
          e.currentTarget.select();
          !groups.includes(activeGroup) &&
            setGroup(axisGroups.get(axis), groups);
        }}
        // onClick={() => setGroup(groups[0])}
        onKeyDown={e => controls(e)}
        onKeyUp={e => controls(e)}
        // data-coords={String(index.join("-"))}
      />
    </div>
  );
}
