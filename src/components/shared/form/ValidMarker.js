import "../../../styles/ValidMarker.css";

export default function ValidMarker({ error }) {
  return (
    <>
      <span className={`valid-marker ${!error ? "valid" : "invalid"}`}>
        <svg>
          <use href={`#${!error ? "check-icon" : "cancel-icon"}`} />
        </svg>
      </span>
      <span className="error">{error?.join(", ")}</span>
    </>
  );
}
