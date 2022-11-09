import { useEffect, useRef, useState } from "react";
import { debounce } from "../../utility/helperFuncs";
import { useDragDrop } from "../shared/DragDropProvider";

export default function WordBankEntry({
  entry,
  placed,
  axis,
  toggleAxis,
  placeWord,
  editWord,
  removeWord,
  deleteWord,
}) {
  // const [orientation, setOrientation] = useState("across");
  const [floating, setFloating] = useState(false);
  const [modifying, setModifying] = useState(false);
  const entryItem = useRef();
  const { setHolding } = useDragDrop();

  useEffect(() => !floating && entryItem.current.classList.remove("floating"));
  useEffect(() => {
    const toggle = e => {
      if (e.key === " ") {
        e.preventDefault();
        toggleAxis();
      }
    };
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, [setHolding]);

  const handleDragStart = e => {
    // e.dataTransfer.setData("word-bank-entry", entry);
    setModifying(false);
    setTimeout(() => e.target.classList.add("floating"), 0);
    setFloating(true);
    setHolding({
      entry,
      axis,
      element: e.target,
      callback: placeWord,
    });
  };

  return (
    <>
      <li
        ref={entryItem}
        className={`word-bank-entry flex ${axis} ${placed ? "placed" : ""}`}
        data-word-bank={entry}
        draggable={!placed}
        // onClick={() => setModifying(prev => !prev)}
        onDragStart={e => handleDragStart(e)}
        onDragEnd={e => {
          setFloating(false);
          setHolding({});
        }}
        onKeyDown={e => e.key === " " && floating && toggleAxis()}
        onDoubleClick={e => {
          if (placed) {
            e.preventDefault();
            placed && removeWord();
          }
        }}
      >
        {entry.split("").map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
        <div
          className={`word-bank-entry-edit-cache ${
            modifying ? "active" : ""
          } flex center`}
        >
          <button
            className={`edit-entry ${!placed ? "active" : ""}`}
            onClick={e => {
              e.preventDefault();
              !placed && editWord();
            }}
          >
            <svg>
              <use href="#edit-icon" />
            </svg>
          </button>
          <button
            className={`remove-entry ${placed ? "active" : ""}`}
            onClick={e => {
              e.preventDefault();
              placed && removeWord();
            }}
          >
            <svg>
              <use href="#restart-icon" />
            </svg>
          </button>
          <button
            className={`delete-entry ${!placed ? "active" : ""}`}
            onClick={e => {
              e.preventDefault();
              !placed && deleteWord();
            }}
          >
            &times;
          </button>
        </div>
      </li>
    </>
  );
}
