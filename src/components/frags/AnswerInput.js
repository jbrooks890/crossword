import { useState } from "react";
import "../../styles/AnswerInput.css";

export default function AnswerInput({ entry }) {
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(entry);
  const { group, hint } = focus;
  const elements = group.map(id =>
    document.querySelector(`#${id} .cell-input`)
  );

  return (
    <div id="answer-input" className={active ? "active" : ""}>
      <div className="answer-input-hint">{hint}</div>
      <input
        id="answer-input-box"
        name="answer-input"
        maxLength={group.length}
        // defaultValue={elements
        //   .map(input => (input.value.length ? input.value : " "))
        //   .join("")}
      />
      <button>GO</button>
    </div>
  );
}
