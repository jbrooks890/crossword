import { useState } from "react";

export default function HintNew({ entry, update }) {
  const { name, sum, hint } = entry;
  const maxLength = 200;
  console.log(entry);
  console.log(`${name} length: ${hint.length}`);

  return (
    <li
      className={`hint-input-entry hint-${name}`}
      data-char-count={maxLength - hint.length}
    >
      <h4>{sum}</h4>
      <textarea
        defaultValue={hint ? hint : ""}
        placeholder={`New hint for ${sum}`}
        rows="2"
        maxLength={maxLength}
        onInput={e => update(e.target.value, name)}
        required
      />
    </li>
  );
}
