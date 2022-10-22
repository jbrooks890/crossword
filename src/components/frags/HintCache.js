import "../../styles/HintCache.css"

export default function HintCache({ hints, focusFirst, onHover }) {
  const groups = Array.from(hints.keys());
  const across = [];
  const down = [];

  let count = 0;
  hints.forEach((hint, name) => {
    let [dir] = name.split("-");
    let axis = dir === "across" ? across : down;
    axis.push(
      <li
        key={count++}
        id={`hint-${name}`}
        className="hint"
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
    <div id="hint-cache-wrap">
      <ul id="across-hints" className="hint-cache">
        <h3>Across</h3>
        {across}
      </ul>
      <ul id="down-hints" className="hint-cache">
        <h3>Down</h3>
        {down}
      </ul>
    </div>
  );
}
