import { useState } from "react";
import HintNew from "./HintNew";

export default function HintInput({ groups, active }) {
  // const list = Object.entries(groups);
  // console.log(list);
  // console.log(Object.entries(groups));

  const across = Object.keys(groups)
    .filter(group => groups[group].dir === "across")
    .map(group => groups[group]);
  const down = Object.keys(groups)
    .filter(group => groups[group].dir === "down")
    .map(group => groups[group]);

  console.log(across);

  return (
    <div id="hint-input" className={active ? "active" : ""}>
      {across.length > 0 && (
        <ol className="hint-input-list across-list">
          <h3>Across</h3>
          {Object.entries(across).map((entry, i) => (
            <HintNew key={i} entry={entry} />
          ))}
        </ol>
      )}
      {/* {Object.keys(down).length > 0 && (
        <ol className="hint-input-list down-list">
          <h3>Down</h3>
          {Object.entries(down).map((entry, i) => (
            <HintNew key={i} entry={entry} />
          ))}
        </ol>
      )} */}
    </div>
  );
}
