import "../../styles/ButtonCache.css";

export default function ButtonCache({ giveHint }) {
  return (
    <div id="button-cache">
      <button
        className="cw-button"
        // onClick={e => e.preventDefault()}
        type="reset"
      >
        <svg>
          <use href="#restart-icon" />
        </svg>
      </button>
      <button
        className="cw-button"
        onClick={e => e.preventDefault()}
        type="submit"
      >
        <svg>
          <use href="#check-icon" />
        </svg>
      </button>
      <button
        className="cw-button"
        onClick={e => {
          e.preventDefault();
          giveHint();
        }}
        type="button"
      >
        <svg viewBox="0 0 10 10">
          <text
            dominantBaseline="middle"
            textAnchor="middle"
            // textLength="100%"
            // lengthAdjust={"spaceAndGlyphs"}
            dx="50%"
            dy="50%"
          >
            ?
          </text>
        </svg>
      </button>
    </div>
  );
}
