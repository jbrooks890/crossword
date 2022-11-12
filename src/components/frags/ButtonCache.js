import "../../styles/ButtonCache.css";
import { usePlayMaster } from "../contexts/PlayMasterProvider";

export default function ButtonCache({ giveHint, clear }) {
  const game = usePlayMaster()[4];

  const hasContent = () =>
    game &&
    [...game.input]
      .filter(([id]) => !game.assists.includes(id))
      .filter(entry => entry[1]).length > 0;

  return (
    <div id="button-cache">
      {/* ------ RESET ------ */}
      <button
        className={`cw-button reset ${hasContent() ? "active" : "inactive"}`}
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
      {/* ------ SUBMIT ------ */}
      <button
        className="cw-button submit"
        onClick={e => e.preventDefault()}
        type="submit"
      >
        <svg>
          <use href="#check-icon" />
        </svg>
      </button>
      {/* ------ HELP/ASSIST ------ */}
      <button
        className={`cw-button help ${
          game && game.assists.length < 3 ? "active" : "inactive"
        }`}
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
