import "../../styles/ButtonCache.css";

export default function ButtonCache({ giveHint, clear }) {
  return (
    <div id="button-cache">
      <button
        className="cw-button reset"
        onClick={e => {
          e.preventDefault();
          clear();
        }}
        type="reset"
      >
        <svg>
          <use href="#restart-icon" />
        </svg>
      </button>
      <button
        className="cw-button submit"
        onClick={e => e.preventDefault()}
        type="submit"
      >
        <svg>
          <use href="#check-icon" />
        </svg>
      </button>
      <button
        className="cw-button help"
        onClick={e => {
          e.preventDefault();
          giveHint();
        }}
        type="button"
      >
        <svg>
          <use href="#help-icon" />
        </svg>
      </button>
    </div>
  );
}
