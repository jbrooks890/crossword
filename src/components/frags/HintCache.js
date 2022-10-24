import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../../styles/HintCache.css";
import { useActiveGroup } from "../shared/ActiveGroupProvider";

export default function HintCache({
  hints,
  // activeGroup,
  open,
  close,
  focusFirst,
  onHover,
}) {
  const [activeGroup] = useActiveGroup();
  const [refreshTrigger, triggerRefresh] = useState(true);
  const direction = activeGroup.split("-")[0];
  const groups = [...hints];
  const hintCache = useRef();

  // console.log({ open });

  // console.log({ active, open });

  // useLayoutEffect(() => {
  //   const { current } = hintCache;
  //   if (open)
  //     current.style.maxWidth = current.getBoundingClientRect().width + "px";
  //   // console.log(current);
  // }, [open]);

  // useEffect(() => triggerRefresh(prev => !prev), [activeGroup]);

  const across = groups.map(([name, hint], i) => {
    const hintName = `hint-${name}`;
    const dir = name.split("-");
    return (
      <li
        key={i}
        id={hintName}
        className={`hint ${name == activeGroup ? "active" : ""}`}
        data-hint-group={name}
        data-hint={hint}
        onClick={() => focusFirst(name, true)}
        onMouseEnter={() => onHover(name, dir)}
        onMouseLeave={() => onHover(name, dir)}
      >
        {hint}
      </li>
    );
  });

  const down = groups.map(([name, hint], i) => {
    const dir = name.split("-");
    return (
      <li
        key={i}
        id={`hint-${name}`}
        className={`hint ${name == activeGroup ? "active" : ""}`}
        data-hint-group={name}
        data-hint={hint}
        onClick={() => focusFirst(name, true)}
        onMouseEnter={() => onHover(name, dir)}
        onMouseLeave={() => onHover(name, dir)}
      >
        {hint}
      </li>
    );
  });

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
