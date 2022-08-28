import { useEffect, useState } from "react";
import BuildNav from "../BuildNav";
import Frame from "../Frame";
import Grid from "../Grid";
import NewPuzzleForm from "../shared/NewPuzzleForm";

export default function Build() {
  const [newPuzzle, setNewPuzzle] = useState({
    name: "",
    type: "Crossword",
    cols: 20,
    rows: 20,
    version: 1,
    editorMode: { active: true, phase: 0 },
    answerKey: {},
    answers: {},
  });
  const [editorMode, setEditorMode] = useState(false);
  const [phase, setPhase] = useState(0);
  const [grid, setGrid] = useState({
    content: [], // EX: [A0: "T", A1: "E", A2: "S", A3: "T"], ...
    cols: {}, // A: [A0, A1, A2, A3, A4], B: [B0, B1, B2, B3, B4], ...
    rows: {}, // 0: [A0, B0, C0, D1], 1: [A1, B1, C1, D1], ...
    activeCols: [], // [A, B, C, D]
    activeRows: [], // [0,1,2,3]
  });
  // const { content, cols, rows } = grid;

  // useEffect(() => console.log(grid), []);

  console.log(newPuzzle);

  // =========== UPDATE GRID ===========
  const updateGrid = data => {
    setGrid(prev => ({
      ...prev,
      ...data,
    }));
  };

  // =========== CAPTURE ANSWERS ===========
  const captureAnswers = () => {
    const { content, cols: _cols, rows: _rows, activeCols, activeRows } = grid;

    // COMB GRID FOR GROUPS
    // IF ENTRIES ARE GROUPED ADD TO GROUPS -AND- ANSWER KEY
    const cols = {};
    const rows = {};

    Object.keys(_cols)
      .filter(col => activeCols.includes(col))
      .forEach(col => (cols[col] = _cols[col]));
    Object.keys(_rows)
      .filter(row => activeRows.includes(row))
      .forEach(row => (rows[row] = _rows[row]));

    console.log(cols, rows);
  };

  // =========== FIND GROUP ===========
  const findGroups = sets => {
    const { content: _content } = grid;
    const content = Object.keys(_content);

    let groups = [];

    sets.forEach(dir =>
      dir.reduce((prev, curr) => {
        let newGroup;
        if (content.includes(curr)) {
          newGroup = [...prev, curr];
        } else {
          newGroup.length > 1 && groups.push(newGroup);
          newGroup = [];
        }
        return newGroup;
        // let newGroup = prev ? [...prev, curr] : newGroup.length > 1 ? groups.push(newGroup) && []
      })
    );
  };

  // =========== UPDATE PUZZLE ===========

  const updatePuzzle = e => {
    let { name, value, form } = e.target;
    value =
      name === "name"
        ? value.replace(/\s+/g, " ").trim()
        : name === "rows" || name === "cols"
        ? parseInt(value)
        : value;

    let other = {};
    if (name === "rows" || name === "cols") {
      let dir = name === "rows" ? "cols" : "rows";
      other[dir] = parseInt(form[dir].value);
    }
    // console.log(other);
    setNewPuzzle(prev => ({
      ...prev,
      ...other,
      [name]: value,
    }));
  };

  // =========== HANDLE SUBMIT ===========

  const handleSubmit = () => setPhase(prev => prev + 1);

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div id="build-page">
      <h2>Build</h2>
      {phase === 0 && (
        <NewPuzzleForm
          puzzle={newPuzzle}
          updatePuzzle={e => updatePuzzle(e)}
          handleSubmit={handleSubmit}
        />
      )}
      {phase > 0 && <h1>{newPuzzle.name}</h1>}
      {/* {phase > 0 && (
        <Frame puzzle={newPuzzle} editorMode={true} updateGrid={updateGrid} />
      )} */}
      {phase > 0 && (
        <Frame puzzle={newPuzzle}>
          <BuildNav />
          <Grid puzzle={newPuzzle} />
        </Frame>
      )}
    </div>
  );
}
