import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/Modal.css";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

export default function Modal({ isShowing, hide, classList, children }) {
  const [active, setActive] = useState(false);
  const wrapper = useRef();

  // console.log({ isShowing });
  useEffect(() => isShowing && setActive(true), []);

  const closeModal = e => {
    setActive(false);
    hide(true);
  };

  return isShowing
    ? createPortal(
        <>
          <div className="modal-overlay" />
          <div
            className={`modal-wrapper flex col ${
              active ? "active" : ""
            } ${classList}`}
            ref={wrapper}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
            // style={active ? { maxWidth: window.innerWidth + "px" } : null}
            // onClick={closeModal}
          >
            <div className="modal flex col">
              <div
                className="modal-close flex"
                data-dismiss="modal"
                aria-label="close"
                onClick={closeModal}
              >
                &times;
              </div>
              {children}
            </div>
          </div>
        </>,
        document.body
      )
    : null;
}
