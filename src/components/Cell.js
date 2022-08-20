export default function Cell({ cell_name, isJunction, index, answer }) {
  return (
    <td id={cell_name} className={isJunction ? "junction" : null + "cell"}>
      <span className="acrossBox axis-box"></span>
      <span className="downBox axis-box"></span>
      <input
        className={`cell-input ${cell_name} ${answer ? "show" : null}`}
        type="text"
        size="1"
        maxLength="1"
        tabIndex="-1"
        // placeholder={index.join("-")}
        // placeholder={cell_name}
        placeholder={answer ? answer : cell_name} // TODO: remove
        onFocus={e => e.currentTarget.select()}
        data-coords={String(index.join("-"))}
      />
    </td>
  );
}
