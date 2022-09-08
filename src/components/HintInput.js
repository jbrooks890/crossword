import { useState } from "react";
import HintNew from "./HintNew";

export default function HintInput({ groups, active }) {
  // const list = Object.entries(groups);
  // console.log(list);
  // console.log(groups);
  // console.log("%cFISH", "color:lime");

  // const across = Object.keys(groups)
  //   .filter(group => groups[group].dir === "across")
  //   .map(group => groups[group]);
  // const down = Object.keys(groups)
  //   .filter(group => groups[group].dir === "down")
  //   .map(group => groups[group]);

  const across = [...groups.values()].filter(group => group.dir === "across");
  const down = [...groups.values()].filter(group => group.dir === "down");

  return (
    <div id="hint-input" className={active ? "active" : ""}>
      {across.length > 0 && (
        <ol className="hint-input-list across-list">
          <h3>Across</h3>
          {across.map((entry, i) => (
            <HintNew key={i} entry={entry} />
          ))}
        </ol>
      )}
      {down.length > 0 && (
        <ol className="hint-input-list down-list">
          <h3>Down</h3>
          {down.map((entry, i) => (
            <HintNew key={i} entry={entry} />
          ))}
        </ol>
      )}
    </div>
  );
}
