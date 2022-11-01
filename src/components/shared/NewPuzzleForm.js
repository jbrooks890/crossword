import { useEffect, useState } from "react";
import "../../styles/NewPuzzleForm.css";

export default function NewPuzzleForm({
  puzzle,
  phase,
  updatePuzzle,
  start,
  addTag,
  editTag,
  deleteTag,
  active,
  setFormActive,
  validation,
  validate,
}) {
  const [gridLink, setGridLink] = useState(true);
  const { name: title, description, cols, rows, tags } = puzzle;

  useEffect(
    // RESET TAG INPUT
    () => tags.length && (document.querySelector("#tag-input").value = ""),
    [tags]
  );

  const popTagInput = e => {
    const newVal = e.target.textContent.slice(0, -1);
    document.querySelector("#tag-input").value = newVal;
  };

  const handleTagInput = e => {
    e.preventDefault();
    const { value } = e.target;
    value.length && addTag(value);
  };

  return (
    <div
      id="newPuzzleForm"
      className={`${active ? "active" : ""} ${phase > 0 ? "overlay" : ""}`}
    >
      <h2>Build</h2>
      <label htmlFor="name">
        <h4>Title</h4>
        {validation.name && (
          <span className="violation">{validation.name}</span>
        )}
        <input
          name="name"
          type="text"
          placeholder="Puzzle Name"
          onFocus={e => e.currentTarget.select()}
          onInput={e => updatePuzzle(e)}
          onMouseEnter={e => e.currentTarget.focus()}
          defaultValue={title} //TODO
          onChange={() => validation.attempted && validate()}
          // required
        />
      </label>

      {phase === 0 && (
        <>
          <h4 className="label">Grid</h4>
          <div
            className={`newPuzzle-gridSize-wrap ${gridLink ? "linked" : ""}`}
          >
            <NumInput
              dir="cols"
              linked={gridLink}
              defaultValue={cols}
              updatePuzzle={updatePuzzle}
            />
            <button
              className="newPuzzle-gridSize-link"
              type="button"
              onClick={() => setGridLink(prev => !prev)}
            >
              &times;
            </button>
            <NumInput
              dir="rows"
              linked={gridLink}
              defaultValue={rows}
              updatePuzzle={updatePuzzle}
            />
          </div>
        </>
      )}
      {/* --------- SUBMISSION INFO --------- */}
      {phase > 0 && (
        <div className="newPuzzle-complete">
          <label htmlFor="description">
            <h4>Description</h4>
            {validation.description && (
              <span className="violation">{validation.description}</span>
            )}
            <textarea
              name="description"
              defaultValue={description}
              placeholder="What's your puzzle about?"
              onMouseEnter={e => e.target.focus()}
              onInput={e => updatePuzzle(e)}
              onChange={() => validation.attempted && validate()}
              // required
            />
          </label>

          <label htmlFor="tags">
            <h4>Tags</h4>
            <input
              id="tag-input"
              name="tags"
              placeholder="New Tag"
              onMouseEnter={e => e.target.focus()}
              onKeyDown={
                // e => console.log(e)
                e => {
                  // e.preventDefault();
                  // e.key === "Enter" && e.target.value.length && addTag(e);
                  e.key === "Enter" && handleTagInput(e);
                }
              }
            />
            {tags.length > 0 && (
              <ul className="newPuzzle-tags-output">
                {tags.map((tag, i) => (
                  <li key={i} onClick={e => popTagInput(e)}>
                    {tag}
                    <div className="delete-tag" onClick={() => deleteTag(tag)}>
                      &times;
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </label>
        </div>
      )}
      <button
        className="newPuzzle-submit"
        type={phase === 0 ? "button" : "submit"}
        onClick={phase === 0 ? start : undefined}
      >
        {phase === 0 ? "Start" : "Submit"}
      </button>
      {/* --------- CLOSE BUTTON --------- */}
      {phase > 0 && (
        <button className="close-button" onClick={() => setFormActive(false)}>
          &times;
        </button>
      )}
    </div>
  );
}

// --------------------------------------------------
// <><><><><><><><><> NUMBER INPUT <><><><><><><><><>
// --------------------------------------------------

function NumInput({ dir, linked, defaultValue, updatePuzzle }) {
  const updateGridSize = e => {
    const inputs = [...document.querySelectorAll(".num-input")];

    if (linked) {
      inputs.find(element => element !== e.target).value = e.target.value;
    }
    updatePuzzle(e);
  };

  return (
    <label htmlFor={dir}>
      <input
        name={dir}
        className="num-input"
        type="number"
        min={10}
        max={30}
        defaultValue={defaultValue}
        onMouseEnter={e => e.currentTarget.focus()}
        onMouseLeave={e => e.currentTarget.blur()}
        onFocus={e => e.currentTarget.select()}
        onInput={e => updateGridSize(e)}
        required
      />
    </label>
  );
}
