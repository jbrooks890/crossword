import { useRef, useState } from "react";
import "../../styles/AnswerInput.css";

export default function AnswerInput({
  entry,
  userInput,
  updateInput,
  focusNextGroup,
}) {
  const [active, setActive] = useState(true);
  const { dir, group, hint, name } = entry;
  const elements = group.map(id =>
    document.querySelector(`#${id} .cell-input`)
  );

  const input = useRef();
  const proceedBtn = useRef();
  // console.log(userInput);

  const displayEntryStyle = {};

  // console.log(entry);
  const parseUserInput = e => {
    const { value } = e.currentTarget;
    // console.log({ value });
    for (let i = 0; i < group.length; i++) {
      const char = value.charAt(i);
      updateInput(group[i], char ? char.toUpperCase() : " ");
    }
  };

  const proceedToNext = e => {
    e.preventDefault();
    input.current.value = "";
    focusNextGroup();
  };

  const inputBtnCtrls = e => {
    const { target, key } = e;
    switch (key) {
      case "Enter":
        e.preventDefault();
        proceedBtn.current.click();
        break;
      case "Tab":
        e.preventDefault();
        console.log(e);
        break;
    }
  };

  // console.log(userInput);

  return (
    <div
      id="answer-input"
      className={["flex", "col", "center", active ? "active" : ""].join(" ")}
    >
      <div className="answer-input-hint">{hint}</div>
      <div className="input-display flex">
        {[...userInput].map(([id, entry], i) => (
          <button
            key={i}
            className="input-display-entry flex center"
            data-cell-id={id}
            onClick={e => {
              e.preventDefault();
              input.current.focus();
              input.current.setSelectionRange(i, i + 1);
            }}
          >
            {entry}
          </button>
        ))}
      </div>

      <input
        ref={input}
        id="answer-input-box"
        type="text"
        name="answer-input"
        maxLength={group.length}
        onInput={e => parseUserInput(e)}
        onKeyDown={e => inputBtnCtrls(e)}
        onKeyUp={e =>
          e.target.setSelectionRange(
            e.target.selectionEnd,
            e.target.selectionEnd + 1
          )
        }
        // value={[...userInput.values()].join("")}
      />
      <button
        ref={proceedBtn}
        className="proceed"
        onClick={e => proceedToNext(e)}
      />
    </div>
  );
}
