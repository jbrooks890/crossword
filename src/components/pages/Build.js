import { useEffect, useState } from "react";
import "../../styles/Build.css";
import BuildNav from "../frags/BuildNav";
import Frame from "../frags/Frame";
import Grid from "../frags/Grid";
import HintInput from "../frags/HintInput";
import { BuildMasterProvider } from "../shared/BuildMasterProvider";
import NewPuzzleForm from "../shared/NewPuzzleForm";

export default function Build() {
  const [newPuzzle, setNewPuzzle] = useState({
    name: "Boogie",
    type: "Crossword",
    description: "",
    cols: 10,
    rows: 10,
    version: 1,
    editorMode: { active: true, phase: 0 },
    answerKey: {},
    answers: [],
    tags: [],
  });
  const sectionTabs = ["Grid", "Hints", "Preview"];
  const [activeSection, setActiveSection] = useState(0);
  const [formActive, setFormActive] = useState(true);
  const { phase } = newPuzzle.editorMode;

  // console.log(grid);
  useEffect(
    () => console.log(newPuzzle),
    [newPuzzle.answers.group, activeSection, newPuzzle.answerKey]
  );
  // console.log(newPuzzle);

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

  const updateAnswerKey = (e, id, $answers) => {
    const { value } = e.target;
    if (value.length) {
      console.log(`%cTEST`, "color:red");
      setNewPuzzle(prev => ({
        ...prev,
        answerKey: { ...prev.answerKey, [id]: value.toUpperCase() },
      }));
    }
  };

  // =========== NEW PUZZLE START ===========

  const newPuzzleStart = e => {
    e.preventDefault();
    setFormActive(false);
    setNewPuzzle(prev => ({
      ...prev,
      editorMode: { ...prev.editorMode, phase: 1 },
    }));
  };

  // =========== NEW PUZZLE SUBMIT ===========

  const newPuzzleSubmit = e => {
    e.preventDefault();
    console.log(`%cSUBMIT PUZZLE`, "color: cyan");
    console.log(e);
    // setNewPuzzle(prev => ({
    //   ...prev,
    //   editorMode: { ...prev.editorMode, phase: 1 },
    // }));
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

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div id="build-page">
      <BuildMasterProvider state={[newPuzzle, setNewPuzzle]}>
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
            />
          )}
          {phase > 0 && (
            <>
              <BuildNav
                sections={sectionTabs}
                active={activeSection}
                changeSection={setActiveSection}
              />
              <div id="cw-grid-wrap" className="flex">
                <Grid
                  puzzle={newPuzzle}
                  active={activeSection === 0 || activeSection === 2}
                  preview={activeSection === 2}
                  updatePuzzleGroups={updatePuzzleGroups}
                  updateAnswerKey={updateAnswerKey}
                  setNewPuzzle={setNewPuzzle}
                />
                <HintInput
                  active={activeSection === 1}
                  groups={newPuzzle.answers}
                  update={updateHint}
                />
              </div>
            </>
          )}
        </Frame>
      </BuildMasterProvider>
    </div>
  );
}
