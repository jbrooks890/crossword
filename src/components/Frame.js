import { useState, useEffect } from "react";
import ButtonCache from "./ButtonCache";
import Grid from "./Grid";
import HintBox from "./HintBox";
import HintCache from "./HintCache";

export default function Frame({ puzzle }) {
  const [editorMode, setEditorMode] = useState(false);
  const [gridWidth, gridHeight] = puzzle.gridSize;
  const [activeGroup, setActiveGroup] = useState("");
  const { answerKey, answers } = puzzle;

  const setGroup = name => {
    // console.log(answers[name]);
    setActiveGroup(answers[name]);
  };

  // console.log(answers);

  return (
    <form id="crossword">
      <HintBox hint={activeGroup.hint} />
      <Grid
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        editorMode={editorMode}
        answerKey={answerKey}
        answers={answers}
        cellClick={setGroup}
      />
      {/* <HintCache hints={answers.map(answer => answer.hint)} /> */}
      <ButtonCache />
    </form>
  );
}
