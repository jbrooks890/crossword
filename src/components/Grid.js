import Cell from "./Cell";

export default function Grid({
  gridWidth,
  gridHeight,
  editorMode,
  answerKey,
  answers,
}) {
  const getLetter = n => {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    // console.log(String.fromCharCode(first + n - 1));
    return String.fromCharCode(first + n).toUpperCase();
  };

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

  const drawGrid2 = () => {
    const totalCells = gridWidth * gridHeight;
    let count = 0;
    let cells = [];
    let allGroups = Object.keys(answers);

    while (count < totalCells) {
      // 18 --> [0,1], 19 --> [1,1]
      let x = count % gridHeight;
      let y = Math.floor(count / gridWidth);
      let cellName = getLetter(x) + y;
      let groups = allGroups.filter(entry =>
        answers[entry].group.includes(cellName)
      );
      let display = [];

      groups.forEach(entry => {
        let across = entry.split("-")[0] === "across";
        let group = answers[entry].group;

        if (across) {
          if (group[0] === cellName) {
            display.push("first");
          } else if (group[group.length - 1] === cellName) {
            display.push("last");
          }
        } else {
          if (group[0] === cellName) {
            display.push("top");
          } else if (group[group.length - 1] === cellName) {
            display.push("bottom");
          }
        }
      });

      // display.length && console.log(cellName, display);
      // answerKey[cellName] && console.log(groups);

      cells.push(
        <Cell
          key={count}
          cell_name={cellName}
          isJunction={groups.length > 1}
          index={[x, y]}
          answer={answerKey[cellName] ? answerKey[cellName] : null}
          groups={groups}
          display={display.length && display}
        />
      );
      count++;
    }
    return cells;
  };

  return (
    // <table id="cw-grid" className={editorMode ? "ready" : null}>
    //   <tbody>{drawGrid()}</tbody>
    // </table>
    <div
      id="cw-grid"
      className="grid"
      style={{
        gridTemplate: `repeat(${gridHeight}, 48px) / repeat(${gridWidth}, 48px)`,
      }}
    >
      {drawGrid2()}
    </div>
  );
}
