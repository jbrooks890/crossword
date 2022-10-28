import { useEffect, useRef, useState } from "react";
import "../../styles/AnswerInput.css";
import { usePlayMaster } from "../shared/PlayMasterProvider";

export default function AnswerInput({
  entry,
  userInput,
  updateInput,
  focusNextGroup,
  hintCacheOpen,
  toggleHintCache,
}) {
  const [active, setActive] = useState(true);
  const { group, hint } = entry;
  const activeGroup = usePlayMaster()[0];
  const game = usePlayMaster()[4];

  const inputs = useRef([]);
  const proceedBtn = useRef();

  useEffect(() => selectEmpty(), [activeGroup]);

  // =========== PROCEED TO NEXT ===========

  const proceedToNext = e => {
    e.preventDefault();
    focusNextGroup();
  };

  // =========== SELECT EMPTY ===========

  const selectEmpty = () => {
    const target = group.indexOf(
      [...userInput.keys()].find(id => userInput.get(id) === "")
    );

    target >= 0 && inputs.current[target].focus();
  };

  // =========== MOVE TO ===========
  const moveTo = destination => {
    const target =
      inputs.current[
        destination >= 0 && destination < group.length ? destination : null
      ];
    target && target.focus();
  };

  // =========== BUTTON CONTROLS: INPUT ===========

  const inputBtnCtrls = (e, id, index) => {
    const { target, key, type, which } = e;
    const { value: content } = target;
    const printable = which >= 65 && which <= 90;

    // console.log({ key, which, printable });

    switch (type) {
      case "keyup":
        // if (printable) focusNext(index);
        break;
      case "keydown":
        if (printable)
          e.target.addEventListener("keyup", () => moveTo(index + 1), {
            once: true,
          });

        switch (key) {
          case "Enter":
            e.preventDefault();
            proceedBtn.current.click();
            break;
          case "Tab":
            // e.preventDefault();
            // console.log(e);
            break;
          case "Backspace":
            // !content && moveTo(index - 1);
            e.target.addEventListener("keyup", () => moveTo(index - 1), {
              once: true,
            });
            break;
          case "ArrowLeft":
            e.preventDefault();
            moveTo(index - 1);
            break;
          case "ArrowRight":
            e.preventDefault();
            moveTo(index + 1);
            break;
          case " ":
            e.preventDefault();
            moveTo(index + 1);
            break;
        }
        break;
    }
  };

  // console.log([...userInput.values()].join(""));

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div
      id="answer-input"
      className={["flex", "col", "center", active ? "active" : ""].join(" ")}
    >
      <div className="answer-input-hint">{hint}</div>
      <div className="input-display flex">
        {[...userInput].map(([id, entry], i) => (
          <input
            key={i}
            ref={id => (inputs.current[i] = id)}
            className={`input-display-entry ${
              game.assists.includes(id) ? "assisted" : ""
            }`}
            data-cell-id={id}
            type="text"
            maxLength="1"
            value={entry}
            onClick={e => e.target.select()}
            onFocus={e => e.target.select()}
            onKeyDown={e => inputBtnCtrls(e, id, i)}
            // onKeyUp={e => inputBtnCtrls(e, id, i)}
            onChange={e => updateInput(id, e.target.value.toUpperCase())}
          />
        ))}
      </div>
      <button
        ref={proceedBtn}
        className="proceed"
        onClick={e => proceedToNext(e)}
      />
      <button
        className="hint-cache-toggle"
        onClick={e => {
          e.preventDefault();
          toggleHintCache();
        }}
      >
        <svg>
          <use href="#list-icon" />
        </svg>
      </button>
    </div>
  );
}
