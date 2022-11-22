import "../../../styles/ValidMarker.css";

export default function ValidMarker({ isValid }) {
  return (
    <span className={`valid-marker ${isValid ? "valid" : "invalid"}`}>
      <svg>
        <use href={`#${isValid ? "check-icon" : "cancel-icon"}`} />
      </svg>
    </span>
  );
}
