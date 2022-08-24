import { useState } from "react";

export default function Cell({
  cell_name: id,
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
  const [coords, setCoords] = useState(index);
  const [axis, setAxis] = useState();

  let xGroup;
  let yGroup;
  const axisGroups = new Map();

  // id === "A0" && console.log(id);

  groups.forEach((group) => {
    if (group.split("-")[0] === "across") {
      xGroup = group; // TODO: REMOVE
      axisGroups.set("across", group);
    } else {
      yGroup = group; // TODO: REMOVE
      axisGroups.set("down", group);
    }
  });

  // =========== SELECT DIRECTION ===========
  const selectDir = (e, dir) => {
    e.preventDefault();
    const cell = document.getElementById(id);
    const cellInput = cell.querySelector(".cell-input");
    setAxis(dir);
    setGroup(axisGroups.get(dir));
    cellInput.focus();
  };

  return (
    <div
      id={id}
      className={[
        "cell",
        answer ? "show" : null,
        groups.length ? groups.join(" ") : null,
        isJunction ? "junction" : null,
        xGroup ? "across" : null,
        yGroup ? "down" : null,
        display ? display.join(" ") : null,
        crop ? "crop " : null,
      ]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()}
      data-groups={groups.join(" ")}
      onMouseEnter={() =>
        axisGroups.forEach((group, dir) => onHover(group, dir))
      }
      onMouseLeave={() =>
        axisGroups.forEach((group, dir) => onHover(group, dir))
      }
    >
      <span className={`acrossBox axis-box ${xGroup ? xGroup : ""}`}></span>
      <span className={`downBox axis-box ${yGroup ? yGroup : ""}`}></span>
      {isJunction && (
        // ====== AXIS SELECTOR BOX ======
        <div className="axis-select">
          <button
            className="select-across"
            onClick={(e) => selectDir(e, "across")}
          ></button>
          <button
            className="select-down"
            onClick={(e) => selectDir(e, "down")}
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
        onFocus={(e) => e.currentTarget.select()}
        onClick={() => setGroup(groups[0])}
        onKeyDown={(e) => controls(e)}
        onKeyUp={(e) => controls(e)}
        // data-coords={String(index.join("-"))}
      />
    </div>
  );
}
