import { useState } from "react";

export default function Cell({
  cell_name,
  isJunction,
  index,
  answer,
  groups,
  display,
  crop,
  onClick,
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
      // className={`cell ${answer ? "show" : ""} ${
      //   isJunction ? "junction" : ""
      // } ${xGroup ? "across" : ""} ${yGroup ? "down" : ""} ${
      //   display ? display.join(" ") : ""
      // } ${crop ? "crop" : ""}`.trim()}
      className={[
        "cell",
        answer ? "show" : null,
        isJunction ? "junction" : null,
        xGroup ? "across" : null,
        yGroup ? "down" : null,
        display ? display.join(" ") : null,
        crop ? "crop " : null,
      ]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()}
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
        onFocus={e => e.currentTarget.select()}
        onClick={() => onClick(groups[0])}
        // data-coords={String(index.join("-"))}
      />
    </td>
  );
}
