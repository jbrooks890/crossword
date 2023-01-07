import { useRef, useState } from "react";
import ValidMarker from "./ValidMarker";

export default function Password({
  field,
  label,
  validation,
  // isValid,
  error,
  value,
  criteria,
  required,
  onChange,
}) {
  const [showing, toggleShowing] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  const target = useRef();
  const criteriaRef = useRef();

  const ShowPassword = () => (
    <button
      className="show-password flex center"
      type="button"
      onClick={e => {
        e.preventDefault();
        toggleShowing(prev => !prev);
      }}
      tabIndex={-1}
    >
      <svg>
        <use href="#eye-con" />
      </svg>
    </button>
  );

  const toggleCriteria = () => setShowCriteria(prev => !prev);

  return (
    <label htmlFor={field} data-label={label}>
      <span onClick={toggleCriteria}>
        {label}
        {/* isValid, */}
        {validation && <ValidMarker error={error} />}
      </span>
      {criteria && (
        <ul
          ref={criteriaRef}
          className={`criteria ${showCriteria ? "show" : "hide"}`}
          style={
            showCriteria
              ? {
                  maxHeight: criteriaRef.current.scrollHeight + "px",
                }
              : null
          }
        >
          {criteria.split("; ").map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      )}
      <div
        className="password-wrap flex middle"
        style={{ position: "relative", boxSizing: "border-box" }}
      >
        <input
          ref={target}
          type={showing ? "text" : "password"}
          name={field}
          id={field}
          className={showing ? "showing" : ""}
          onChange={onChange}
          value={value}
        />
        <ShowPassword />
      </div>
    </label>
  );
}
