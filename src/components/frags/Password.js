import { useRef, useState } from "react";

export default function Password({ label, display, handleInput }) {
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
      <input
        ref={target}
        type={showing ? "text" : "password"}
        name={label}
        className={showing ? "showing" : ""}
        onChange={handleInput}
      />
      <ShowPassword />
    </label>
  );
}
