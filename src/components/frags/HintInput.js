import { useState } from "react";
import "../../styles/HintInput.css"
import HintNew from "./HintNew";

export default function HintInput({ groups, active, update }) {
  const across = [...groups.values()].filter(group => group.dir === "across");
  const down = [...groups.values()].filter(group => group.dir === "down");
  // console.log(`%c--- RENDER HINTS ---`, "color: coral");

  return (
    <div id="hint-input" className={active ? "active" : ""}>
      {across.length > 0 && (
        <ol className="hint-input-list across-list">
          <h3>Across</h3>
          {across.map((entry, i) => (
            <HintNew key={i} entry={entry} update={update} />
          ))}
        </ol>
      )}
      {down.length > 0 && (
        <ol className="hint-input-list down-list">
          <h3>Down</h3>
          {down.map((entry, i) => (
            <HintNew key={i} entry={entry} update={update} />
          ))}
        </ol>
      )}
    </div>
  );
}
