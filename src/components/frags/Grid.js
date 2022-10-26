import { useEffect, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import "../../styles/Grid.css";
import { useActiveGroup } from "../shared/ActiveGroupProvider";
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
  const $MOBILE = useMediaQuery();
  // const [mini, toggleMini] = useState($MOBILE);
  // const [activeGroup] = useActiveGroup();
  // activeGroup && console.log({ activeGroup });

  useEffect(() => setGrid(createGrid()), [answerKey, answers.group]);

  // ------------------------------------------------
  // <><><><><><><><> TESTING (TODO) <><><><><><><><>
  // ------------------------------------------------

  // console.log(
  //   `%c${"<>".repeat(8)}\\ GRID /${"<>".repeat(8)}`,
  //   "color: coral; text-transform: uppercase"
  // );

  // console.log(grid);

  // =========== GET LETTER ===========
  function getLetter(n) {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    return String.fromCharCode(first + n).toUpperCase();
  }

  // =========== FORMAT CELL DATA ===========
  function formatCellData(id, col, x, y) {
    // id === "A0" && console.log("%cNOT SUPPOSED TO BE RUNNING!!!", "color: red");
    // console.log(`%cFORMAT CELL: ${id}`, "color: red");
    // console.log(answers);
    const groupNames = [...answers.keys()];
    const groups = groupNames
      .filter(entry => answers.get(entry).group.includes(id))
      .map(entry => answers.get(entry));
    let display = [];

    groups.size && console.log({ id }, "GROUPS", groups); // TODO

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
      crop: !grid.activeCols.includes(col) || !grid.activeRows.includes(y),
    };
  }

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
      return (
        <Cell
          key={count}
          cell_name={id}
          index={[x, y]}
          {...((!editing || phase >= 2) && formatCellData(id, col, x, y))}
          controls={e => controls(e)}
          editorMode={editorMode}
          hoverGroup={hoverGroup} // BOTH
          focusCell={focusCell} // PLAY
          axis={axis} // EDITOR
          toggleAxis={toggleAxis} // EDITOR
          operations={operations}
          preview={preview}
          updateGrid={e => updateGrid(e, id, col, y)} // EDITOR
          updateAnswerKey={e => editing && updateAnswerKey(e, id)}
          captureAnswer={e => e.target.value && captureAnswer(e, id, col, y)}
          // captureAnswers={captureAnswers}
        />
      );
    });
  };

  // =========== UPDATE GRID ===========

  const updateGrid = (e, id, col, row) => {
    const { value } = e.target;
    setGrid(prev => {
      const { content } = prev;
      if (value) {
        return {
          ...prev,
          content: content.set(id, value),
        };
      } else {
        content.delete(id);
        return { ...prev };
      }
    });
  };

  // =========== FIND GROUP ===========
  // "SET" = ROW or COLUMN
  const findGroups = (sets, isRow, $keys) => {
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
        if ($keys[cell]) {
          set.group.push(cell);
          // set.sum += content.get(cell).toUpperCase();
          set.sum += $keys[cell].toUpperCase();
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

  // =========== CAPTURE ANSWER ===========
  function captureAnswer(e, id, _col, _row) {
    // console.log(`%cCAPTURE ANSWERS`, "color: orange");
    // console.log(`%cTEST---`, "color: red");
    const { value } = e.target;
    const { cols, rows, activeCols, activeRows } = grid;
    const { answerKey } = puzzle;
    const $answer = { [id]: value.toUpperCase() };
    const $answerKey = { ...answerKey, ...$answer };
    const $activeCols = [...activeCols, _col];
    const $activeRows = [...activeRows, _row];

    const $cols = Object.keys(cols)
      .filter(col => $activeCols.includes(col))
      .map(id => cols[id]);
    const $rows = Object.keys(rows)
      .filter(row => $activeRows.includes(Number(row)))
      .map(id => rows[id]);

    // console.log($cols, $rows);

    updatePuzzleGroups($answer, [
      ...findGroups($rows, true, $answerKey),
      ...findGroups($cols, false, $answerKey),
    ]);
  }

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
