import { useState, useEffect } from "react";

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
  activeGroup,
  focusCell,
}) {
  /* const [axis, setAxis] = useState(
    crop
      ? null
      : isJunction // IF JUNCTION, DEFAULT TO DIRECTION OF...
      ? activeGroup.split("-")[0] // ...CURRENT GROUP, OR IF NOT
      : groups[0].split("-")[0] // ...THE ONLY GROUP AVAILABLE
  ); */
  const [axis, setAxis] = useState("");

  useEffect(() => {
    if (groups.length) {
      // ^^ SHOULD BE BASED ON 'CROP' BUT CROP IS NOT WORKING
      if (isJunction) {
        setAxis(activeGroup.split("-")[0]);
      } else {
        setAxis(groups[0].split("-")[0]);
      }
    } else {
      setAxis(undefined);
    }
  }, []);

  const axisGroups = new Map();

  groups.forEach(group => axisGroups.set(group.split("-")[0], group));

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
        onFocus={async e => {
          await setAxis("across");
          document.querySelector(`#${id} .cell-input`).focus();
        }}
      ></span>
      <span
        className={`downBox axis-box ${
          axisGroups.has("down") ? axisGroups.get("down") : ""
        }`}
        onFocus={async e => {
          await setAxis("down");
          document.querySelector(`#${id} .cell-input`).focus();
        }}
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
