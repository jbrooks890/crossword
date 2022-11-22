import { useRef, useState } from "react";
import ValidMarker from "./ValidMarker";

export default function Password({
  label,
  display,
  validation,
  isValid,
  value,
  onChange,
}) {
  const [showing, toggleShowing] = useState(false);

  const target = useRef();

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

  return (
    <label
      htmlFor={label}
      data-label={display ? display : label.replace(/([A-Z])/g, " $1")}
    >
      <span>
        {display ? display : label.replace(/([A-Z])/g, " $1")}
        {validation && <ValidMarker isValid={isValid} />}
      </span>
      <div
        className="password-wrap flex middle"
        style={{ position: "relative", boxSizing: "border-box" }}
      >
        <input
          ref={target}
          type={showing ? "text" : "password"}
          name={label}
          className={showing ? "showing" : ""}
          onChange={onChange}
          value={value}
        />
        <ShowPassword />
      </div>
    </label>
  );
}
