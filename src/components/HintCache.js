export default function HintCache({ hints, onClick }) {
  const groups = Array.from(hints.keys());
  const across = [];
  const down = [];

  let count = 0;
  hints.forEach((hint, name) => {
    let axis = name.split("-")[0] === "across" ? across : down;
    axis.push(
      <li
        key={count++}
        id={`hint-${name}`}
        className="hint"
        data-hint-group={name}
        data-hint={hint}
        onClick={() => onClick(name, true)}
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
