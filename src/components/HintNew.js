import { useState } from "react";

export default function HintNew({ entry }) {
  const { groupName, sum, hint } = entry;
  // const { sum, hint } = content;
  const [chars, setChars] = useState(hint.length);
  const maxLength = 200;

  return (
    <li
      className={`hint-input-entry hint-${groupName}`}
      // data-char-count={`${chars}/${maxLength}`}
      data-char-count={maxLength - chars}
    >
      <h4>{sum}</h4>
      <textarea
        placeholder={hint ? hint : `New hint for ${sum}`}
        rows="2"
        maxLength={maxLength}
        onInput={e => setChars(e.target.value.length)}
        required
      />
    </li>
  );
}
