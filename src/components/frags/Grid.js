import { useEffect, useState } from "react";
import "../../styles/Grid.css";
import Cell from "./Cell";

export default function Grid({
  puzzle,
  mini,
  toggleMini,
  controls,
  hoverGroup,
  focusCell,
  operations,
  updatePuzzleGroups,
  updateAnswerKey,
  preview,
  setNewPuzzle,
  ...props
}) {
  const { cols, rows, editorMode, answerKey, answers } = puzzle;
  const { active: editing, phase } = editorMode;
  // ------------------------------------------------
  // <><><><><><><><><> GRID STATE <><><><><><><><><>
  // ------------------------------------------------
  const [grid, setGrid] = useState({
    cells: [],
    cols: {},
    rows: {},
    activeCells: [],
    activeCols: [],
    activeRows: [],
  });
  const [axis, toggleAxis] = useState(true); // TRUE = across, FALSE = down

  useEffect(() => setGrid(createGrid()), [answerKey, answers.group]);
  // useEffect(() => console.log(grid), [grid.activeCells]);

  // =========== GET LETTER ===========
  function getLetter(n) {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    return String.fromCharCode(first + n).toUpperCase();
  }

  const getGroups = id =>
    [...answers.keys()]
      .filter(entry => answers.get(entry).group.includes(id))
      .map(entry => answers.get(entry));

  // =========== FORMAT CELL DATA ===========
  function formatCellData(id, col, x, y) {
    // const groupNames = [...answers.keys()];
    // const groups = groupNames
    //   .filter(entry => answers.get(entry).group.includes(id))
    //   .map(entry => answers.get(entry));
    const groups = getGroups(id);
    let display = [];

    // groups.size && console.log({ id }, "GROUPS", groups); // TODO

    groups.forEach(entry => {
      let { group, dir } = entry;
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
      // crop: !grid.activeCols.includes(col) || !grid.activeRows.includes(y),
      member: grid.activeCells.includes(id),
    };
  }

  // =========== GROUP ANSWERS ===========
  const groupAnswers = () => {
    const activeTracks = [...grid.activeCols, ...grid.activeRows];
    const { cols, rows, activeCols, activeRows, activeCells } = grid;

    const groups = [];

    const search = (track, active) => {
      let group = [];
      let dir = track === rows ? "across" : "down";

      // console.log(active, track);

      active.forEach(set => {
        for (let i = 0; i <= track[set].length; i++) {
          const cell = track[set][i];
          // console.log({ cell });
          if (answerKey[cell]) {
            group.push(cell);
          } else {
            if (group.length > 1) {
              const name = `${dir}-${group[0]}`;
              groups.push([
                name,
                {
                  name,
                  dir,
                  group,
                  sum: group.map(cell => answerKey[cell]).join(""),
                  hint: "",
                },
              ]);
            }
            group = [];
          }
        }
      });
    };

    search(cols, activeCols);
    search(rows, activeRows);
    setNewPuzzle(prev => ({
      ...prev,
      answers: new Map(groups),
    }));
  };

  useEffect(() => editing && groupAnswers(), [answerKey]);

  // =========== CREATE GRID ===========
  function createGrid() {
    console.log("%cCREATE GRID", "color:red");
    const $answerKey = Object.keys(answerKey);
    const totalCells = cols * rows;

    let $grid = {
      cells: [],
      cols: {},
      rows: {},
      activeCells: [], // [A0, A1, A2...]
      activeCols: [], // [A, B, C, D...]
      activeRows: [], // [0,1,2,3...]
    };

    for (let count = 0; count < totalCells; count++) {
      let x = count % cols;
      let y = Math.floor(count / cols);
      let col = getLetter(x);
      let id = col + y;

      $grid.cols[col] ? $grid.cols[col].push(id) : ($grid.cols[col] = [id]);
      $grid.rows[y] ? $grid.rows[y].push(id) : ($grid.rows[y] = [id]);
      $grid.cells.push({ id, col, x, y });

      if ($answerKey.includes(id)) {
        !$grid.activeCells.includes(id) && $grid.activeCells.push(id);
        !$grid.activeCols.includes(col) && $grid.activeCols.push(col);
        !$grid.activeRows.includes(y) && $grid.activeRows.push(y);
      }
    }

    return $grid;
  }

  // =========== RENDER GRID ===========
  const renderGrid = () => {
    return grid.cells.map((cell, count) => {
      const { id, col, x, y } = cell;
      const groups = getGroups(id);
      return (
        <Cell
          key={count}
          cell_name={id}
          index={[x, y]}
          // {...((!editing || phase >= 2) && formatCellData(id, col, x, y))}
          {...((!editing || preview) && formatCellData(id, col, x, y))}
          {...(groups.length && { groups })}
          crop={!grid.activeCols.includes(col) || !grid.activeRows.includes(y)}
          controls={e => controls(e)}
          editorMode={editorMode}
          focusCell={focusCell} // PLAY
          axis={axis} // EDITOR
          toggleAxis={toggleAxis} // EDITOR
          preview={preview}
        />
      );
    });
  };

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div
      id="cw-grid"
      className={["grid", mini ? "mini" : "", preview ? "preview" : ""].join(
        " "
      )}
      style={{
        gridTemplate: `repeat(${
          editing && !preview ? rows : grid.activeRows.length
        }, ${mini ? "1fr" : "48px"}) / repeat(${
          editing && !preview ? cols : grid.activeCols.length
        }, ${mini ? "1fr" : "48px"})`,
      }}
    >
      {renderGrid()}
    </div>
  );
}
