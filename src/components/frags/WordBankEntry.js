import { useEffect, useRef, useState } from "react";
import { debounce } from "../../utility/helperFuncs";
import { useDragDrop } from "../shared/DragDropProvider";

export default function WordBankEntry({ entry, placed, setPlaced }) {
  const [orientation, setOrientation] = useState("across");
  const [floating, setFloating] = useState(false);
  const entryItem = useRef();
  const { setHolding } = useDragDrop();

  useEffect(() => !floating && entryItem.current.classList.remove("floating"));
  useEffect(() => {
    const toggleOrientation = e => {
      // console.log(e);
      if (e.key === " ") {
        e.preventDefault();
        setOrientation(prev => (prev === "across" ? "down" : "across"));
      }
    };
    window.addEventListener("keydown", toggleOrientation);
    return () => window.removeEventListener("keydown", toggleOrientation);
  }, [setHolding]);

  const handleDragStart = e => {
    e.dataTransfer.setData("word-bank-entry", entry);
    setTimeout(() => e.target.classList.add("floating"), 0);
    setFloating(true);
    setHolding({ entry, orientation, element: e.target, callback: setPlaced });
  };

  return (
    <li
      ref={entryItem}
      className={`word-bank-entry ${orientation} ${
        orientation === "down" ? "col" : ""
      } ${placed ? "placed" : ""}`}
      data-word-bank={entry}
      draggable={!placed}
      onDragStart={e => handleDragStart(e)}
      onDragEnd={e => {
        setFloating(false);
        setHolding({});
      }}
      onKeyDown={e =>
        e.key === " " &&
        floating &&
        setOrientation(prev => (prev === "across" ? "down" : "across"))
      }
    >
      {entry.split("").map((letter, i) => (
        <span key={i}>{letter}</span>
      ))}
    </li>
  );
}
