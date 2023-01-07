import { useState } from "react";
import "../../styles/HintInput.css";
import HintNew from "./HintNew";

export default function HintInput({
  groups,
  active,
  update,
  validation,
  validate,
}) {
  const across = [...groups.values()].filter(group => group.dir === "across");
  const down = [...groups.values()].filter(group => group.dir === "down");

  // validation && console.log(validation);
  // console.log(validation.attempted);

  return (
    <div id="hint-input" className={active ? "active" : ""}>
      {[...groups.values()].length > 0 ? (
        <>
          {across.length > 0 && (
            <ol className="hint-input-list across-list">
              <h3>Across</h3>
              {across.map((entry, i) => (
                <HintNew
                  key={i}
                  entry={entry}
                  update={update}
                  violation={
                    validation.answers && validation.answers.has(entry.name)
                      ? validation.answers.get(entry.name).hint
                      : null
                  }
                  validate={() => (validation.attempted ? validate() : null)}
                />
              ))}
            </ol>
          )}
          {down.length > 0 && (
            <ol className="hint-input-list down-list">
              <h3>Down</h3>
              {down.map((entry, i) => (
                <HintNew
                  key={i}
                  entry={entry}
                  update={update}
                  violation={
                    validation.answers && validation.answers.has(entry.name)
                      ? validation.answers.get(entry.name).hint
                      : null
                  }
                  validate={() => (validation.attempted ? validate() : null)}
                />
              ))}
            </ol>
          )}
        </>
      ) : (
        <p className="placeholder">Your puzzle has no words yet.</p>
      )}
    </div>
  );
}
