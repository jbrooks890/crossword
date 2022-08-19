export default function Cell({ cell_index, isJunction, index }) {
  return (
    <td className={isJunction ? "junction" : null}>
      <span className="acrossBox"></span>
      <span className="downBox"></span>
      <input
        className={`cell ${cell_index}`}
        type="text"
        size="1"
        maxLength="1"
        // placeholder={index.join("-")}
        placeholder={cell_index}
        onFocus={e => e.currentTarget.select()}
      />
    </td>
  );
}
