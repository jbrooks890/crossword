import { useEffect, useState } from "react";
import apiUrl from "../../config";
import "../../styles/Build.css";
import BuildNav from "../frags/BuildNav";
import Frame from "../frags/Frame";
import Grid from "../frags/Grid";
import HintInput from "../frags/HintInput";
import { BuildMasterProvider } from "../contexts/BuildMasterProvider";
import NewPuzzleForm from "../shared/NewPuzzleForm";
import axios from "axios";
import WordBank from "../frags/WordBank";
import BuildWindow from "../frags/BuildWindow";
import DragDropProvider from "../contexts/DragDropProvider";
import { useAuth } from "../contexts/AuthContextProvider";

export default function Build() {
  const [newPuzzle, setNewPuzzle] = useState({
    name: "",
    type: "Crossword",
    description: "",
    cols: 10,
    rows: 10,
    version: 1,
    editorMode: { active: true, phase: 0 },
    answerKey: {},
    answers: new Map(),
    tags: [],
  });
  const [puzzleValidation, setPuzzleValidation] = useState({
    name: "",
    description: "",
    answerKey: "",
    answers: new Map(),
    attempted: false,
  });
  const sectionTabs = ["Grid", "Hints", "Preview"];
  const [formActive, setFormActive] = useState(true);
  const [orientation, setOrientation] = useState(true); // ACROSS(T) / DOWN(F)
  const [previewMode, togglePreviewMode] = useState(false);
  const [wordList, setWordList] = useState([]);
  const { phase } = newPuzzle.editorMode;

  const { auth } = useAuth();

  // console.log(grid);
  useEffect(
    () => console.log(newPuzzle),
    [newPuzzle.answers.group, newPuzzle.answerKey]
  );
  // console.log(newPuzzle);

  useEffect(
    () => puzzleValidation.attempted && console.log(puzzleValidation),
    [puzzleValidation]
  );

  // console.log(wordList);

  // =========== TOGGLE AXIS WITH [ SPACE ] KEY ===========

  useEffect(() => {
    const toggleAxis = e => {
      const { code, target } = e;
      if (code === "Space" && target == document.body) {
        e.preventDefault();
        setOrientation(prev => !prev);
      }
    };

    window.addEventListener("keydown", toggleAxis);
    return () => window.removeEventListener("keydown", toggleAxis);
  }, []);

  // =========== CLEAR ANSWERS ===========
  function clearAnswers() {
    setWordList([...newPuzzle.answers.values()].map(group => group.sum));
    setNewPuzzle(prev => ({
      ...prev,
      answerKey: {},
      answers: new Map(),
    }));
  }

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

  // =========== UPDATE PUZZLE GROUPS ===========

  const updatePuzzleGroups = (answer, updatedAnswers) => {
    // console.log(`%cRUNNING UPDATE PUZZLE GROUPS`, "color: yellow");
    const $answers = new Map(
      updatedAnswers.map(answer => {
        return [
          answer.name,
          {
            ...answer,
            // KEEP HINT IF THIS ANSWER GROUP EXISTS ALREADY
            hint: newPuzzle.answers.has(answer.name)
              ? newPuzzle.answers.get(answer.name).hint
              : "",
          },
        ];
      })
    );

    setNewPuzzle(prev => ({
      ...prev,
      answerKey: { ...prev.answerKey, ...answer },
      answers: $answers,
      editorMode: {
        ...prev.editorMode,
        phase: $answers.size ? 2 : 1,
      },
    }));
  };

  // =========== UPDATE PUZZLE HINT ===========
  const updateHint = (entry, name) => {
    // console.log(`%cRUNNING UPDATE HINT`, "color: coral");
    const $answers = new Map([...newPuzzle.answers]);
    const target = $answers.get(name);
    target.hint = entry;
    setNewPuzzle(prev => ({
      ...prev,
      answers: $answers,
    }));
  };

  // ============ UPDATE ANSWERS ============

  // const updateAnswerKey = (e, id, $answers) => {
  //   const { value } = e.target;
  //   if (value.length) {
  //     console.log(`%cTEST`, "color:red");
  //     setNewPuzzle(prev => ({
  //       ...prev,
  //       answerKey: { ...prev.answerKey, [id]: value.toUpperCase() },
  //     }));
  //   }
  // };

  // =========== NEW PUZZLE START ===========

  const newPuzzleStart = e => {
    e.preventDefault();
    setFormActive(false);
    setNewPuzzle(prev => ({
      ...prev,
      editorMode: { ...prev.editorMode, phase: 1 },
    }));
  };

  // =========== ADD TAG ===========

  const addTag = $tag => {
    // e.preventDefault();
    const tag = $tag.toLowerCase().trim().replace(/\s+/g, "-");
    !newPuzzle.tags.includes(tag) &&
      setNewPuzzle(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    // e.target.value = "";
  };

  // =========== EDIT TAG ===========

  const editTag = (e, index) => {
    const newVal = e.target.textContent;
    let { value } = document.querySelector("#tag-input");
    newVal.slice(-1);
    value = newVal;
    setNewPuzzle(prev => ({
      ...prev,
      tags: [...prev.tags, prev.tags.splice(index, 1, newVal)],
    }));
  };

  // =========== DELETE TAG ===========

  const deleteTag = target => {
    setNewPuzzle(prev => {
      // let { tags } = prev;
      return { ...prev, tags: prev.tags.filter(tag => tag !== target) };
    });
  };

  // =========== VALIDATE NEW PUZZLE!! ===========

  function validatePuzzle() {
    const { name, description, answerKey, answers } = newPuzzle;
    let errors = {};

    // NAME
    if (!name || name.length < 5)
      errors.name = "Name must be at least 5 characters";

    // DESCRIPTION
    if (!description || description.length < 10)
      errors.description = "Description must be at least 10 characters";

    // ANSWER KEY
    if (Object.keys(answerKey).length === 0)
      errors.answerKey = "Puzzle has no content.";

    // ANSWERS
    let answerErrors = [];
    answers.forEach((content, groupName) => {
      const { name, dir, group, sum, hint } = content;
      let groupErrors = {};

      Object.keys(content).forEach(type => {
        switch (type) {
          case "name":
            if (!name) groupErrors["name"] = `${groupName} has no group name.`;
            break;
          case "dir":
            if (!dir) {
              groupErrors["dir"] = `${groupName} has no directional axis.`;
            } else if (!(dir === "across" || dir === "down")) {
              groupErrors[
                "dir"
              ] = `${groupName} has invalid directional axis: ${dir}`;
            }
            break;
          case "group":
            if (!group.length) {
              groupErrors["group"] = `${groupName} has no content.`;
            }
            break;
          case "sum":
            if (!sum) groupErrors.sum = `${groupName} has no answer sum.`;
            break;
          case "hint":
            // console.log("HINT");
            if (!hint) {
              groupErrors["hint"] = `hint required.`;
            } else if (hint.length < 10) {
              groupErrors["hint"] = `hint must be at least 10 characters.`;
            }
            break;
        }
      });

      if (Object.keys(groupErrors).length > 0) {
        answerErrors.push([groupName, groupErrors]);
      }
    });

    if (answerErrors.length) {
      console.log(answerErrors);
      errors.answers = new Map(answerErrors);
    }

    setPuzzleValidation({ ...errors, attempted: true });

    return !Object.keys(errors).length;
  }

  // =========== NEW PUZZLE SUBMIT ===========

  const newPuzzleSubmit = e => {
    e.preventDefault();

    validatePuzzle()
      ? axios({
          url: `${apiUrl}/puzzles`,
          method: "POST",
          data: {
            ...newPuzzle,
            author: auth.username,
            answers: [...newPuzzle.answers.values()],
            editorMode: { active: false, phase: 0 },
          },
        })
      : console.log("Puzzle has errors!");

    // console.log(newPuzzle);
  };

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div id="build-page">
      <BuildMasterProvider
        state={[newPuzzle, setNewPuzzle, orientation, setOrientation]}
      >
        <Frame
          puzzle={newPuzzle}
          submit={newPuzzleSubmit}
          setFormActive={setFormActive}
        >
          {(phase === 0 || formActive) && (
            <NewPuzzleForm
              puzzle={newPuzzle}
              phase={phase}
              updatePuzzle={e => updatePuzzle(e)}
              start={e => newPuzzleStart(e)}
              addTag={e => addTag(e)}
              editTag={editTag}
              deleteTag={deleteTag}
              active={formActive}
              setFormActive={setFormActive}
              validation={puzzleValidation}
              validate={validatePuzzle}
            />
          )}
          {phase > 0 && (
            <>
              <BuildNav
                puzzle={newPuzzle}
                axis={orientation}
                toggleAxis={() => setOrientation(prev => !prev)}
                previewing={previewMode}
                togglePreviewing={() => togglePreviewMode(prev => !prev)}
                clearAnswers={clearAnswers}
              />
              <div id="cw-grid-wrap" className="flex">
                <div id="puzzle-window" className="flex">
                  <DragDropProvider>
                    <Grid
                      puzzle={newPuzzle}
                      preview={previewMode}
                      updatePuzzleGroups={updatePuzzleGroups}
                      setNewPuzzle={setNewPuzzle}
                      axis={orientation}
                      toggleAxis={() => setOrientation(prev => !prev)}
                    />
                    <BuildWindow>
                      <WordBank
                        section="Words"
                        puzzle={newPuzzle}
                        wordList={wordList}
                        axis={orientation}
                        toggleAxis={() => setOrientation(prev => !prev)}
                      />
                      <HintInput
                        groups={newPuzzle.answers}
                        update={updateHint}
                        validation={puzzleValidation}
                        validate={validatePuzzle}
                        section="Hints"
                      />
                    </BuildWindow>
                  </DragDropProvider>
                </div>
              </div>
            </>
          )}
        </Frame>
      </BuildMasterProvider>
    </div>
  );
}
