import { useState } from "react";

export default function HintNew({ entry, update, violation, validate }) {
  const { name, sum, hint } = entry;
  const maxLength = 200;

  // console.log({ entry, violation });

  return (
    <li
      className={`hint-input-entry hint-${name}`}
      data-char-count={maxLength - hint.length}
    >
      <h4>{sum}</h4>
      {violation && <span className="violation">{violation}</span>}
      <textarea
        value={hint}
        placeholder={`New hint for ${sum}`}
        rows="2"
        maxLength={maxLength}
        onInput={e => update(e.target.value, name)}
        onChange={() => validate()}
        // required
      />
    </li>
  );
}
