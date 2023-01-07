import { useRef, useState } from "react";
import "../../../styles/Checkbox.css";

export default function Checkbox({ id, classList, label, onChange, def }) {
  const input = useRef();
  const wrapper = useRef();

  return (
    <label className={`custom-checkbox ${classList.join(" ")}`} htmlFor={id}>
      <input
        ref={input}
        type="checkbox"
        id={id}
        // style={{ display: "none" }}
        onChange={onChange}
        checked={def}
      />
      <div className="checkmark flex center">
        <svg>
          <use href="#check-icon" />
        </svg>
      </div>
      <span className="label-text">{label}</span>
    </label>
  );
}
