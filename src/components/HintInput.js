import { useState } from "react";
import HintNew from "./HintNew";

export default function HintInput({ groups, active }) {
  // const list = Object.entries(groups);
  const { across, down } = groups;
  // console.log(groups);
  // console.log(list);

  return (
    <div id="hint-input" className={active ? "active" : ""}>
      <ol className="hint-input-list across-list">
        <h3>Across</h3>
        {Object.entries(across).map((entry, i) => (
          <HintNew key={i} entry={entry} />
        ))}
      </ol>
      <ol className="hint-input-list down-list">
        <h3>Down</h3>
        {Object.entries(down).map((entry, i) => (
          <HintNew key={i} entry={entry} />
        ))}
      </ol>
    </div>
  );
}
