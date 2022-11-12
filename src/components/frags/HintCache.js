import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import "../../styles/HintCache.css";
import { usePlayMaster } from "../contexts/PlayMasterProvider";

export default function HintCache({
  hints,
  open,
  close,
  focusFirst,
  gridMini,
  groupCells,
}) {
  const [activeGroup, setActiveGroup, previewGroup, setPreviewGroup, game] =
    usePlayMaster();
  // const direction = activeGroup.split("-")[0];
  const groups = [...hints];
  const hintCache = useRef();
  const $CAN_HOVER = useMediaQuery("hover");
  const [direction, setDirection] = useState(activeGroup.split("-")[0]);

  // console.log(game);

  // console.log(Wrapper.current);
  // useEffect(() => console.log(Wrapper.current));
  useEffect(() => {
    const currentDir = activeGroup.split("-")[0];
    direction !== currentDir && setDirection(currentDir);
  }, [open]);

  const select = name => {
    gridMini ? setActiveGroup(name) : focusFirst(name, true);
    close();
  };

  const format = arr =>
    arr.map(([name, hint], i) => {
      const hintName = `hint-${name}`;
      const dir = name.split("-");
      return (
        <li
          key={i}
          id={hintName}
          className={`hint ${name == activeGroup ? "active" : ""} ${
            previewGroup.includes(name) ? "preview" : ""
          }`}
          data-hint-group={name}
          data-hint={hint}
          onClick={() => select(name)}
          onMouseEnter={() => $CAN_HOVER && setPreviewGroup([name])}
          onMouseLeave={() => $CAN_HOVER && setPreviewGroup([])}
        >
          <>
            <div data-hint-count={i + 1} className="hint-text flex">
              {hint}
            </div>
            {gridMini && game && (
              <div className="user-entry-wrap flex center">
                {groupCells.get(name).map(cell => (
                  <div
                    key={cell}
                    className={`hint-user-entry flex center ${
                      game.assists.includes(cell) ? "assisted" : ""
                    }`}
                  >
                    {game.input.get(cell)}
                  </div>
                ))}
              </div>
            )}
          </>
        </li>
      );
    });

  const toggleDir = () =>
    setDirection(prev => (prev === "across" ? "down" : "across"));

  const across = format(
    groups.filter(([name]) => name.split("-")[0] === "across")
  );
  const down = format(groups.filter(([name]) => name.split("-")[0] === "down"));

  return (
    <div
      ref={hintCache}
      id="hint-cache-wrap"
      className={open ? "active" : "inactive"}
    >
      <h3 onClick={() => toggleDir()}>
        {direction[0].toUpperCase() + direction.slice(1)}
      </h3>
      <ul
        id="across-hints"
        className={`hint-cache ${
          direction === "across" ? "active" : "inactive"
        }`}
      >
        {across}
      </ul>
      <ul
        id="down-hints"
        className={`hint-cache ${direction === "down" ? "active" : "inactive"}`}
      >
        {down}
      </ul>
      <button
        className="close-button flex center"
        onClick={e => {
          e.preventDefault();
          close();
        }}
      >
        &times;
      </button>
    </div>
  );
}
