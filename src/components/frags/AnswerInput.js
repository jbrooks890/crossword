import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/AnswerInput.css";
import { useActiveGroup } from "../shared/ActiveGroupProvider";

export default function AnswerInput({
  entry,
  userInput,
  updateInput,
  focusNextGroup,
}) {
  const [active, setActive] = useState(true);
  const { group, hint } = entry;
  const game = useActiveGroup()[4];
  const activeGroup = useActiveGroup()[0];

  const input = useRef();
  const proceedBtn = useRef();
  const previousEntry = useMemo(() => userInput, [activeGroup]);

  // console.log(previousEntry);

  // useEffect(() => selectEmpty());

  const parseUserInput = e => {
    const { value } = e.currentTarget;
    // console.log({ value });
    for (let i = 0; i < group.length; i++) {
      const char = value.charAt(i);
      updateInput(group[i], char && char !== " " ? char.toUpperCase() : "");
    }
  };

  const proceedToNext = e => {
    e.preventDefault();
    input.current.value = "";
    focusNextGroup();
  };

  const selectEmpty = e => {
    // const next = e.target.value.indexOf(" ");
    // e.target.setSelectionRange(next, next + 1);

    const next = [...userInput.values()].indexOf("");
    // console.log({ next });
    input.current.setSelectionRange(next, next + 1);
  };

  const inputBtnCtrls = e => {
    const { target, key, type, which } = e;
    const printable = which >= 65 && which <= 90;

    switch (type) {
      case "keyup":
        printable && selectEmpty();
        break;
      case "keydown":
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
        break;
    }
  };

  // console.log([...userInput.values()].join(""));

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
            className={`input-display-entry flex center ${
              game.assists.includes(id) ? "assisted" : ""
            }`}
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
        onKeyUp={e => inputBtnCtrls(e)}
        // onFocus={e => selectEmpty(e)}
        value={[...userInput.values()]
          .map(char => (char ? char : " "))
          .join("")}
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
