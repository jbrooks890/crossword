import Cell from "./Cell";

export default function Grid({
  gridWidth,
  gridHeight,
  editorMode,
  answerKey,
  answers,
  controls,
  hoverGroup,
  focusCell,
  getLetter,
}) {
  const activeCells = Object.keys(answerKey);
  const activeCols = [];
  const activeRows = [];
  activeCells.forEach(cell => {
    const [col, _row] = cell.match(/[\d\.]+|\D+/g);
    const row = parseInt(_row);
    !activeCols.includes(col) && activeCols.push(col);
    !activeRows.includes(row) && activeRows.push(row);
  });

  // =========== DRAW GRID ===========

  const drawGrid = () => {
    // const groupNames = Object.keys(answers);
    const totalCells = gridWidth * gridHeight;
    let count = 0;
    let cells = [];
    // console.log({ totalCells });

    while (count < totalCells) {
      // 18 --> [0,1], 19 --> [1,1]
      let x = count % gridWidth;
      let y = Math.floor(count / gridWidth);
      let col = getLetter(x);
      let id = col + y;

      // console.log({ count, x, y, gridWidth, gridHeight });

      cells.push(
        <Cell
          key={count}
          cell_name={id}
          index={[x, y]}
          {...(!editorMode && formatCellData(id, x, y))}
          controls={e => controls(e)}
          editorMode={editorMode}
          hoverGroup={hoverGroup}
          focusCell={focusCell}
        />
      );
      count++;
    }

    return cells;
  };

  // =========== FORMAT CELL DATA ===========

  const formatCellData = (id, x, y) => {
    const groupNames = Object.keys(answers);
    const col = getLetter(x);
    const groups = groupNames.filter(entry =>
      answers[entry].group.includes(id)
    );
    let display = [];

    groups.forEach(entry => {
      let across = entry.split("-")[0] === "across";
      let group = answers[entry].group;

      if (across) {
        if (group[0] === id) {
          display.push("first");
        } else if (group[group.length - 1] === id) {
          display.push("last");
        }
      } else {
        if (group[0] === id) {
          display.push("top");
        } else if (group[group.length - 1] === id) {
          display.push("bottom");
        }
      }
    });

    return {
      isJunction: groups.length > 1,
      answer: answerKey[id] ? answerKey[id] : null,
      groups,
      display: display.length && display,
      crop: !activeCols.includes(col) || !activeRows.includes(y),
    };
  };

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div
      id="cw-grid"
      className="grid"
      style={{
        gridTemplate: `repeat(${
          editorMode ? gridHeight : activeRows.length
        }, 48px) / repeat(${editorMode ? gridWidth : activeCols.length}, 48px)`,
      }}
    >
      {drawGrid()}
    </div>
  );
}
