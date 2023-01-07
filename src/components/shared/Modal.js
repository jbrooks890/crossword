import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/Modal.css";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

export default function Modal({
  isShowing,
  auto = false,
  classList,
  children,
}) {
  const [active, setActive] = useState(false);
  const wrapper = useRef();

  // console.log({ isShowing });
  useEffect(() => isShowing && setActive(true), []);

  const closeModal = e => {
    document.body.classList.toggle("modal-lock");
    setActive(false);
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
          >
            <div className="modal flex col">
              {!auto && (
                <div
                  className="modal-close flex"
                  data-dismiss="modal"
                  aria-label="close"
                  onClick={() => !auto && closeModal()}
                >
                  &times;
                </div>
              )}
              {children}
            </div>
          </div>
        </>,
        document.body
      )
    : null;
}
