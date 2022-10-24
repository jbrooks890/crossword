import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import "../../styles/HintCache.css";
import { useActiveGroup } from "../shared/ActiveGroupProvider";

export default function HintCache({
  hints,
  // activeGroup,
  open,
  close,
  focusFirst,
  // onHover,
}) {
  const [activeGroup, _, previewGroup, setPreviewGroup] = useActiveGroup();
  const [refreshTrigger, triggerRefresh] = useState(true);
  const direction = activeGroup.split("-")[0];
  const groups = [...hints];
  const hintCache = useRef();
  const $CAN_HOVER = useMediaQuery("hover");

  // console.log(groups);

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
          onClick={() => focusFirst(name, true)}
          onMouseEnter={() => $CAN_HOVER && setPreviewGroup([name])}
          onMouseLeave={() => $CAN_HOVER && setPreviewGroup([])}
        >
          {hint}
        </li>
      );
    });

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
      <h3>{direction[0].toUpperCase() + direction.slice(1)}</h3>
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
    </div>
  );
}
