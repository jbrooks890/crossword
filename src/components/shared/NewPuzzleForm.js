import { useState } from "react";

export default function NewPuzzleForm({ puzzle, updatePuzzle, handleSubmit }) {
  const [gridLink, setGridLink] = useState(true);
  const { gridSize } = puzzle;
  const [x, y] = gridSize;

  return (
    <form
      id="newPuzzleForm"
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <label htmlFor="newPuzzle-name">
        <h4>Name</h4>
        <input
          name="newPuzzle-name"
          type="text"
          placeholder="Puzzle Name"
          onFocus={e => e.currentTarget.select()}
          required
        />
      </label>

      <h4 className="label">Grid</h4>
      <div className={`newPuzzle-gridSize-wrap ${gridLink ? "linked" : ""}`}>
        {/* <h4>Grid</h4> */}
        <NumInput dir="row" linked={gridLink} defaultValue={x} />
        <button
          className="newPuzzle-gridSize-link"
          type="button"
          onClick={() => setGridLink(prev => !prev)}
        >
          &times;
        </button>
        <NumInput dir="col" linked={gridLink} defaultValue={y} />
      </div>
      <button type="submit">Start</button>
    </form>
  );
}

function NumInput({ dir, linked, defaultValue }) {
  const label = `newPuzzle-gridSize-${dir}s`;
  const updateGridSize = e => {
    const inputs = [...document.querySelectorAll(".num-input")];
    if (linked) {
      // inputs.forEach(input => (input.value = e.currentTarget.value));
      inputs.find(element => element !== e.currentTarget).value =
        e.currentTarget.value;
    }
  };

  return (
    <label htmlFor={label}>
      <input
        name={label}
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
