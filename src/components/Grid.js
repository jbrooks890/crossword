import Cell from "./Cell";

export default function Grid({ gridWidth, gridHeight, editorMode, answerKey }) {
  const getLetter = n => {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    // console.log(String.fromCharCode(first + n - 1));
    return String.fromCharCode(first + n).toUpperCase();
  };

  console.log(answerKey);

  const drawGrid = () => {
    let rows = [];
    let count = 0;
    for (let y = 0; y < gridHeight; y++) {
      let row = [];
      for (let x = 0; x < gridWidth; x++) {
        const cellName = getLetter(x) + y;
        row.push(
          <Cell
            key={count++}
            cell_name={cellName}
            isJunction={false}
            index={[x, y]}
            answer={answerKey[cellName] ? answerKey[cellName] : null}
          />
        );
      }
      rows.push(row);
    }

    // console.log(rows);
    return rows.map((row, i) => <tr key={i}>{row}</tr>);
  };

  return (
    <table id="cw-grid" className={editorMode ? "ready" : null}>
      <tbody>{drawGrid()}</tbody>
    </table>
  );
}
