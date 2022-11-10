import { useEffect, useState } from "react";
import "../../styles/Grid.css";
import { debounce, getLetter } from "../../utility/helperFuncs";
import { useDragDrop } from "../shared/DragDropProvider";
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
  preview,
  axis,
  toggleAxis,
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
  // const [axis, toggleAxis] = useState(true); // TRUE = across, FALSE = down
  const [dropPreview, setDropPreview] = useState([]);
  const [fitFrame, setFitFrame] = useState(false);

  const $DnD = useDragDrop();
  const { holding, setHolding } = $DnD ? $DnD : {};

  // -----------------------------------------------
  // @@@@@@@@@@@@@@@@@ CREATE GRID @@@@@@@@@@@@@@@@@
  // -----------------------------------------------

  useEffect(() => setGrid(createGrid()), [answerKey]);

  // =========== GET GROUPS ===========

  const getGroups = id =>
    [...answers.keys()]
      .filter(entry => answers.get(entry).group.includes(id))
      .map(entry => answers.get(entry));

  // =========== FORMAT CELL DATA ===========
  function formatCellData(id) {
    const groups = getGroups(id);
    let display = [];

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
      // isJunction: groups.length > 1,
      answer: answerKey[id] ? answerKey[id] : null,
      groups,
      display: display.length && display,
      member: grid.activeCells.includes(id),
    };
  }

  // =========== GROUP ANSWERS ===========
  // function groupAnswers() {
  const groupAnswers = (activeCols, activeRows) => {
    // console.log(`%cTEST!`, "color:coral");
    // console.log("answers:\n", answerKey);
    const { cols, rows } = grid;
    // console.log(activeCols, activeRows);

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
              // console.log(`%cGROUPING ANSWERS!`, "color:lime");
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

  // =========== GET DROP TARGETS ===========
  const getDropTargets = (x, y, across, length) => {
    let targets = [];
    let base = across ? x : y;
    let range = base + length;

    for (across ? x : y; across ? x < range : y < range; across ? x++ : y++) {
      targets.push(getLetter(x) + y);
    }
    // console.log("targets:", targets);
    setDropPreview(targets);
  };

  // =========== HANDLE DRAG PREVIEW ===========
  const handleDragPreview = (e, index) => {
    // console.log(`%cHANDLE DRAG PREVIEW!`, "color: lime");
    // console.log("holding:", holding.entry);
    const { cols, rows } = puzzle;
    const { entry, axis } = holding;
    const [x, y] = index;
    const dir = axis ? x : y;
    const track = axis ? rows : cols;
    const range = dir + entry.length;

    range <= track && getDropTargets(x, y, axis, entry.length);
  };

  // =========== HANDLE DROP ===========
  const handleDrop = e => {
    e.preventDefault();
    const { entry, axis } = holding;
    const newEntires = Object.fromEntries(
      dropPreview.map(id => [id, entry.charAt(dropPreview.indexOf(id))])
    );

    // callback(entry, `${orientation}-${dropPreview[0]}`);

    setHolding({});
    setDropPreview([]);
    setNewPuzzle(prev => ({
      ...prev,
      answerKey: {
        ...prev.answerKey,
        ...newEntires,
      },
    }));
  };

  const wordDrop = {
    dragEnter: handleDragPreview,
    dragLeave: () => setDropPreview([]),
    drop: e => handleDrop(e),
  };

  // =========== CREATE GRID ===========
  function createGrid() {
    console.log("%cCREATE GRID", "color:red");
    // console.log("answers:\n", answerKey);
    const $answerKey = Object.keys(answerKey);
    // console.log("answers:\n", $answerKey);
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

    const { activeCols, activeRows } = $grid;
    editing && groupAnswers(activeCols, activeRows);
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
          {...((!editing || preview) && formatCellData(id, col, x, y))}
          {...(groups.length && { groups })}
          crop={!grid.activeCols.includes(col) || !grid.activeRows.includes(y)}
          dropPreview={
            editing && dropPreview.includes(id) && holding.entry
              ? holding.entry.charAt(dropPreview.indexOf(id))
              : null
          }
          {...(editing && wordDrop)}
          isJunction={groups.length > 1}
          // member={grid.activeCells.includes(id)}
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
      className={[
        "grid",
        mini ? "mini" : "",
        preview ? "preview" : "",
        fitFrame && "fit",
      ].join(" ")}
      style={{
        gridTemplate: `repeat(${
          editing && !preview ? rows : grid.activeRows.length
        }, ${mini || fitFrame ? "1fr" : "48px"}) / repeat(${
          editing && !preview ? cols : grid.activeCols.length
        }, ${mini || fitFrame ? "1fr" : "48px"})`,
      }}
    >
      {renderGrid()}
    </div>
  );
}
