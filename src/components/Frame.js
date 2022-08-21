import { useState, useEffect } from "react";
import ButtonCache from "./ButtonCache";
import Grid from "./Grid";
import HintCache from "./HintCache";

export default function Frame({ puzzle }) {
  const [editorMode, setEditorMode] = useState(false);
  const [gridWidth, gridHeight] = puzzle.gridSize;
  const { answerKey, answers } = puzzle;

  return (
    <form id="crossword">
      <Grid
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        editorMode={editorMode}
        answerKey={answerKey}
        answers={answers}
      />
      <HintCache />
      <ButtonCache />
    </form>
  );
}
