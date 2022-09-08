import { useEffect, useState } from "react";
import Cell from "./Cell";

export default function Grid({
  puzzle,
  controls,
  hoverGroup,
  focusCell,
  operations,
  updatePuzzleGroups,
  preview,
  ...props
}) {
  const [axis, toggleAxis] = useState(true); // TRUE = across, FALSE = down
  const { cols, rows, editorMode, answerKey, answers } = puzzle;
  const { active: editing, phase } = editorMode;

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
    // console.log(answers);
    const col = getLetter(x);
    const groupNames = [...answers.keys()];
    const groups = groupNames.filter(entry =>
      answers.get(entry).group.includes(id)
    );
    let display = [];

    groups.forEach(entry => {
      let { group, dir } = answers.get(entry);
      // let across = dir === "across";

      if (dir === "across") {
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

  // =========== FIND GROUP ===========
  // "SET" = ROW or COLUMN
  const findGroups = (sets, isRow) => {
    const { content } = grid;
    const activeCells = [...content.keys()];
    const dir = isRow ? "across" : "down";

    let groups = [];

    // loop thru each row/column...
    // collect entries until it hits a break (empty cell)...
    // --OR hits the end of the row/column...
    // THEN save the group.

    sets.forEach(arr => {
      let set = {
        group: [],
        sum: "",
      };
      for (let i = 0; i <= arr.length; i++) {
        const cell = arr[i];
        if (activeCells.includes(cell)) {
          set.group.push(cell);
          set.sum += content.get(cell).toUpperCase();
        } else {
          // if the new group has at least 2 entries...
          if (set.group.length > 1) {
            // set.name = `${dir}-${set.group[0]}`;
            groups.push({
              ...set,
              name: `${dir}-${set.group[0]}`,
              dir: dir,
              hint: "",
            });
          }
          set = {
            group: [],
            sum: "",
          };
        }
      }
    });

    return groups;
  };

  // =========== CAPTURE ANSWERS ===========
  const captureAnswers = () => {
    const { cols, rows, activeCols, activeRows } = grid;

    // COMB GRID FOR GROUPS
    // IF ENTRIES ARE GROUPED ADD TO GROUPS -AND- ANSWER KEY

    const _cols = Object.keys(cols)
      .filter(col => activeCols.includes(col))
      .map(id => cols[id]);
    const _rows = Object.keys(rows)
      .filter(row => activeRows.includes(Number(row)))
      .map(id => rows[id]);

    updatePuzzleGroups(Object.fromEntries(grid.content), [
      ...findGroups(_rows, true),
      ...findGroups(_cols, false),
    ]);
  };

  // useEffect(() => captureAnswers(), []);

  // =========== DRAW GRID ===========

  const drawGrid = () => {
    console.log("%cDRAW GRID", "color:red");
    const totalCells = cols * rows;
    let grid = {
      cells: [],
      cols: {},
      rows: {},
    };
    // let count = 0;

    for (let count = 0; count < totalCells; count++) {
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
          {...(phase >= 2 && formatCellData(id, x, y))}
          controls={e => controls(e)}
          editorMode={editorMode}
          hoverGroup={hoverGroup} // BOTH
          focusCell={focusCell} // PLAY
          axis={axis} // EDITOR
          toggleAxis={toggleAxis} // EDITOR
          operations={operations}
          updateGrid={e => updateGrid(e, id, col, y)} // EDITOR
          // captureAnswers={captureAnswers}
        />
      );

      // count++;
    }
    // setGrid(grid);
    return grid;
  };

  // ------------------------------------------------
  // <><><><><><><><><> GRID STATE <><><><><><><><><>
  // ------------------------------------------------

  const { cells, cols: _cols, rows: _rows } = drawGrid();
  const [grid, setGrid] = useState({
    content: new Map(), // EX: [A0: "T", A1: "E", A2: "S", A3: "T"], ...
    cols: _cols, // A: [A0, A1, A2, A3, A4], B: [B0, B1, B2, B3, B4], ...
    rows: _rows, // 0: [A0, B0, C0, D1], 1: [A1, B1, C1, D1], ...
    activeCols: [], // [A, B, C, D]
    activeRows: [], // [0,1,2,3]
  });

  // =========== UPDATE GRID ===========

  const updateGrid = (e, id, col, row) => {
    const { value } = e.target;
    setGrid(prev => {
      const { content, activeCols, activeRows } = prev;
      if (value) {
        return {
          ...prev,
          content: content.set(id, value),
          activeCols: activeCols.includes(col)
            ? activeCols
            : [...activeCols, col],
          activeRows: activeRows.includes(row)
            ? activeRows
            : [...activeRows, row],
        };
      } else {
        let activeCells = [...content.keys()];
        console.log(activeCells);

        content.delete(id);

        // If ROW or COL doesn't have any other content, remove it from actives
        // activeCols.length > 1 && activeCols.splice(activeCols.indexOf(col), 1);
        // activeRows.length > 1 && activeRows.splice(activeRows.indexOf(row), 1);
        return { ...prev };
      }
    });
  };

  useEffect(() => phase >= 1 && captureAnswers(), [grid]);
  // editing && phase >= 1 && captureAnswers();

  // ------------------------------------------------
  // <><><><><><><><> TESTING (TODO) <><><><><><><><>
  // ------------------------------------------------

  console.log(
    `%c${"<>".repeat(8)}\\ GRID /${"<>".repeat(8)}`,
    "color: plum; text-transform: uppercase"
  );

  console.log(grid);

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
      {cells}
    </div>
  );
}
