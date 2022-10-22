import "../../styles/ButtonCache.css";

export default function ButtonCache({ giveHint }) {
  return (
    <div id="button-cache">
      <button
        className="cw-button"
        // onClick={e => e.preventDefault()}
        type="reset"
      >
        Reset
      </button>
      <button
        className="cw-button"
        onClick={e => e.preventDefault()}
        type="submit"
      >
        Submit
      </button>
      <button
        className="cw-button"
        onClick={e => {
          e.preventDefault();
          giveHint();
        }}
        type="button"
      >
        Hint
      </button>
    </div>
  );
}
