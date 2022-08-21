export default function Cell({
  cell_name,
  isJunction,
  index,
  answer,
  groups,
  display,
}) {
  let xGroup;
  let yGroup;

  groups.forEach(group => {
    if (group.split("-")[0] === "across") {
      xGroup = group;
    } else {
      yGroup = group;
    }
  });

  return (
    <td
      id={cell_name}
      className={`cell ${answer ? "show" : ""} ${
        isJunction ? "junction" : ""
      } ${xGroup ? "across" : ""} ${yGroup ? "down" : ""} ${
        display ? display.join(" ") : ""
      }`.trim()}
    >
      <span className={`acrossBox axis-box ${xGroup ? xGroup : ""}`}></span>
      <span className={`downBox axis-box ${yGroup ? yGroup : ""}`}></span>
      <input
        className={`cell-input ${cell_name} ${answer ? "show" : null}`}
        // className={`cell-input`}
        type="text"
        size="1"
        maxLength="1"
        tabIndex="-1"
        // placeholder={index.join("-")}
        // placeholder={cell_name}
        placeholder={answer ? answer : cell_name} // TODO: remove
        onFocus={e => e.currentTarget.select()}
        // data-coords={String(index.join("-"))}
      />
    </td>
  );
}
