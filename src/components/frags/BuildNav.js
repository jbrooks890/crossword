import { ReactComponent as AXIS_ICON } from "../../assets/icons/orientation-icon.svg";
import { useDragDrop } from "../contexts/DragDropProvider";

export default function BuildNav({
  puzzle,
  axis,
  toggleAxis,
  previewing,
  togglePreviewing,
  clearAnswers,
}) {
  const { holding } = useDragDrop;
  const { answers } = puzzle;

  return (
    <div id="build-nav">
      {/* ------- PREVIEW ------- */}
      <button
        className={`preview-btn ${previewing ? "active" : ""} ${
          !answers.size ? "inactive" : ""
        }`}
        onClick={e => {
          e.preventDefault();
          answers.size && togglePreviewing();
        }}
      >
        <svg>
          <use href="#eye-con" />
        </svg>
      </button>
      {/* ------- AXIS INDICATOR ------- */}
      <button
        className={`axis-indicator ${axis ? "across" : "down"}`}
        onClick={e => {
          e.preventDefault();
          toggleAxis();
        }}
        onDragOver={e => e.preventDefault()}
        onDragEnter={() => holding && toggleAxis()}
      >
        <AXIS_ICON />
      </button>
      {/* ------- RESET ------- */}
      <button
        className={`reset-btn ${!answers.size ? "inactive" : ""}`}
        onClick={e => {
          e.preventDefault();
          answers.size && clearAnswers();
        }}
      >
        <svg>
          <use href="#restart-icon" />
        </svg>
      </button>
    </div>
  );
}
