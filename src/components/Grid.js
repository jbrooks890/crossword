import Cell from "./Cell";

export default function Grid({ gridWidth, gridHeight, editorMode }) {
  const getLetter = n => {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    // console.log(String.fromCharCode(first + n - 1));
    return String.fromCharCode(first + n).toUpperCase();
  };

  // console.log(getLetter(3));

  const drawGrid = () => {
    let rows = [];
    for (let x = 0; x < gridHeight; x++) {
      let row = [];
      for (let y = 0; y < gridWidth; y++) {
        row.push(<Cell cell_index={getLetter(x) + y} index={[x, y]} />);
      }
      rows.push(row);
    }

    // console.log(rows);
    return rows.map(row => <tr>{row}</tr>);
  };

  return (
    <table id="cw-grid" className={editorMode ? "ready" : null}>
      {drawGrid()}
    </table>
  );
}
