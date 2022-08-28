import { useState, useEffect } from "react";
import Cell from "./Cell";

export default function Grid({
  puzzle,
  controls,
  hoverGroup,
  focusCell,
  // updateGrid,
}) {
  const { cols, rows, editorMode, answerKey, answers } = puzzle;
  const { active: editing, phase } = editorMode;
  // const [grid, setGrid] = useState({});
  const activeCells = Object.keys(answerKey);
  const activeCols = [];
  const activeRows = [];
  activeCells.forEach(cell => {
    const [col, _row] = cell.match(/[\d\.]+|\D+/g);
    const row = parseInt(_row);
    !activeCols.includes(col) && activeCols.push(col);
    !activeRows.includes(row) && activeRows.push(row);
  });

  // useEffect(() => updateGrid(grid), [grid]);

  // =========== DRAW GRID ===========

  const drawGrid = () => {
    console.log("running draw grid", { cols, rows });
    const totalCells = cols * rows;
    let count = 0;
    let cells = [];
    let grid = {
      cols: {},
      rows: {},
    };

    while (count < totalCells) {
      let x = count % cols;
      let y = Math.floor(count / cols);
      let col = getLetter(x);
      let id = col + y;

      grid.cols[col] ? grid.cols[col].push(id) : (grid.cols[col] = [id]);
      grid.rows[y] ? grid.rows[y].push(id) : (grid.rows[y] = [id]);

      cells.push(
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
    console.log(grid);
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

  // =========== GET LETTER ===========
  const getLetter = n => {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    // console.log(String.fromCharCode(first + n - 1));
    return String.fromCharCode(first + n).toUpperCase();
  };

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
      {drawGrid()}
    </div>
  );
}
