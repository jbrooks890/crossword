import { useState } from "react";

export default function Cell({
  cell_name,
  isJunction,
  index,
  answer,
  groups,
  display,
  crop,
  setGroup,
  controls,
}) {
  const [coords, setCoords] = useState(index);
  let xGroup;
  let yGroup;

  // console.log(cell_name, crop);

  groups.forEach(group => {
    if (group.split("-")[0] === "across") {
      xGroup = group;
    } else {
      yGroup = group;
    }
  });

  return (
    <td
      id={cell_name}
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
    >
      <span className={`acrossBox axis-box ${xGroup ? xGroup : ""}`}></span>
      <span className={`downBox axis-box ${yGroup ? yGroup : ""}`}></span>
      <input
        className={`cell-input ${cell_name} ${answer ? "show" : null}`}
        // className={`cell-input`}
        type="text"
        size="1"
        maxLength="1"
        tabIndex="-1"
        pattern="[A-Za-z]"
        onFocus={e => {
          // console.log("Focus:", cell_name);
          e.currentTarget.select();
          setGroup(groups[0]);
        }}
        onClick={e => setGroup(groups[0])}
        onKeyDown={e => controls(e)}
        onKeyUp={e => controls(e)}
        // data-coords={String(index.join("-"))}
      />
    </td>
  );
}
