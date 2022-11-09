import { ReactComponent as AXIS_ICON } from "../../assets/icons/orientation-icon.svg";
import { useDragDrop } from "../shared/DragDropProvider";

export default function BuildNav({
  axis,
  toggleAxis,
  previewing,
  togglePreviewing,
}) {
  const { holding } = useDragDrop;

  return (
    <div id="build-nav">
      {/* ------- PREVIEW ------- */}
      <button
        className={`preview-btn ${previewing ? "active" : "inactive"}`}
        onClick={e => {
          e.preventDefault();
          togglePreviewing();
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
      <button onClick={e => e.preventDefault()}>
        <svg>
          <use href="#restart-icon" />
        </svg>
      </button>
    </div>
  );
}
