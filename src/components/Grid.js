import { useState, useEffect } from "react";
import Cell from "./Cell";

export default function Grid({
  puzzle,
  controls,
  hoverGroup,
  focusCell,
  updateGrid,
  ...props
}) {
  const { cols, rows, editorMode, answerKey, answers } = puzzle;
  const { active: editing, phase } = editorMode;
  const { functions } = props;

  const activeCells = Object.keys(answerKey);
  const activeCols = [];
  const activeRows = [];
  activeCells.forEach(cell => {
    const [col, _row] = cell.match(/[\d\.]+|\D+/g);
    const row = parseInt(_row);
    !activeCols.includes(col) && activeCols.push(col);
    !activeRows.includes(row) && activeRows.push(row);
  });

  // =========== GET LETTER ===========
  const getLetter = n => {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    // console.log(String.fromCharCode(first + n - 1));
    return String.fromCharCode(first + n).toUpperCase();
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

  // =========== DRAW GRID ===========

  const drawGrid = () => {
    console.log("%cTEST", "color:red");
    const totalCells = cols * rows;
    let grid = {
      cells: [],
      cols: {},
      rows: {},
    };
    let count = 0;

    while (count < totalCells) {
      let x = count % cols;
      let y = Math.floor(count / cols);
      let col = getLetter(x);
      let id = col + y;

      grid.cols[col] ? grid.cols[col].push(id) : (grid.cols[col] = [id]);
      grid.rows[y] ? grid.rows[y].push(id) : (grid.rows[y] = [id]);

      grid.cells.push(
        <Cell
          key={count}
          cell_name={id}
          index={[x, y]}
          {...(!editing && formatCellData(id, x, y))}
          controls={e => controls(e)}
          editorMode={editing}
          hoverGroup={hoverGroup}
          focusCell={focusCell}
        />
      );

      count++;
    }
    // setGrid(grid);
    return grid;
  };

  const [grid, setGrid] = useState(drawGrid()); // NOT WORKING
  // const [grid, setGrid] = useState({});
  // useEffect(() => updateGrid && updateGrid(grid), [phase]);

  console.log(
    `%c${"<>".repeat(7)}\\ GRID /${"<>".repeat(7)}`,
    "color: plum; text-transform: uppercase"
  );

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div
      id="cw-grid"
      className="grid"
      style={{
        gridTemplate: `repeat(${
          editing ? rows : activeRows.length
        }, 48px) / repeat(${editing ? cols : activeCols.length}, 48px)`,
      }}
    >
      {grid.cells}
      {/* {drawGrid().cells} */}
    </div>
  );
}
