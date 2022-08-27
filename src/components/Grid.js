import Cell from "./Cell";

export default function Grid({
  gridWidth,
  gridHeight,
  editorMode,
  answerKey,
  answers,
  controls,
  onHover,
  focusCell,
  getLetter,
}) {
  const activeCells = Object.keys(answerKey);
  const activeCols = [];
  const activeRows = [];
  activeCells.forEach((cell) => {
    const [col, _row] = cell.match(/[\d\.]+|\D+/g);
    const row = parseInt(_row);
    !activeCols.includes(col) && activeCols.push(col);
    !activeRows.includes(row) && activeRows.push(row);
  });

  /* const drawGrid = () => {
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

    return rows.map((row, i) => <tr key={i}>{row}</tr>);
  }; */

  const drawGrid = () => {
    const totalCells = gridWidth * gridHeight;
    let count = 0;
    let cells = [];
    // let allGroups = answers.map(answer => answer.group);
    let groupNames = Object.keys(answers);

    // console.log(allGroups);

    while (count < totalCells) {
      // 18 --> [0,1], 19 --> [1,1]
      let x = count % gridHeight;
      let y = Math.floor(count / gridWidth);
      let col = getLetter(x);
      let cellName = col + y;
      let groups = groupNames.filter((entry) =>
        answers[entry].group.includes(cellName)
      );
      let display = [];

      groups.forEach((entry) => {
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

      cells.push(
        <Cell
          key={count}
          cell_name={cellName}
          index={[x, y]}
          // isJunction={groups.length > 1} // PLAY MODE
          // answer={answerKey[cellName] ? answerKey[cellName] : null} // PLAY MODE
          // groups={groups} // PLAY MODE
          // display={display.length && display} // PLAY MODE
          // crop={!activeCols.includes(col) || !activeRows.includes(y)} // PLAY MODE
          {...(!editorMode && {
            // PLAY MODE
            isJunction: groups.length > 1,
            answer: answerKey[cellName] ? answerKey[cellName] : null,
            groups,
            display: display.length && display,
            crop: !activeCols.includes(col) || !activeRows.includes(y),
          })}
          controls={(e) => controls(e)}
          onHover={onHover}
          focusCell={focusCell}
        />
      );
      count++;
    }

    // console.log(cells[Math.floor(Math.random() * cells.length)]);
    return cells;
  };

  return (
    <div
      id="cw-grid"
      className="grid"
      style={{
        gridTemplate: `repeat(${activeRows.length}, 48px) / repeat(${activeCols.length}, 48px)`,
      }}
    >
      {drawGrid()}
    </div>
  );
}
