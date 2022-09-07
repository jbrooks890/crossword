import { useState } from "react";

export default function NewPuzzleForm({
  puzzle,
  updatePuzzle,
  newPuzzleSubmit,
}) {
  const [gridLink, setGridLink] = useState(true);
  const { name: title, cols, rows } = puzzle;

  return (
    <form id="newPuzzleForm" onSubmit={e => newPuzzleSubmit(e)}>
      <h2>Build</h2>
      <label htmlFor="name">
        <h4>Name</h4>
        <input
          name="name"
          type="text"
          placeholder="Puzzle Name"
          onFocus={e => e.currentTarget.select()}
          onInput={e => updatePuzzle(e)}
          // onClick={e => console.log(e)}
          onMouseEnter={e => e.currentTarget.focus()}
          // onMouseLeave={e => e.currentTarget.blur()}
          defaultValue={title} //TODO
          required
        />
      </label>

      <h4 className="label">Grid</h4>
      <div className={`newPuzzle-gridSize-wrap ${gridLink ? "linked" : ""}`}>
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
      <button type="submit">Start</button>
    </form>
  );
}

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
        onInput={e => {
          // console.log(e, e.target.name);
          updateGridSize(e);
        }}
        required
      />
    </label>
  );
}
