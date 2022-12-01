import { useState } from "react";
import useModal from "../../hooks/useModal";
import Modal from "../shared/Modal";

export default function MobileNav({ links }) {
  const [active, setActive] = useState(false);
  const { isShowing, toggle } = useModal();

  return (
    <>
      <div
        className={`mobileNav ${isShowing ? "open" : "closed"}`}
        onClick={toggle}
      >
        <div className="top" />
        <div className="middle" />
        <div className="bottom" />
      </div>
      {isShowing && (
        <Modal isShowing={isShowing} hide={toggle} classList={"nav-modal"}>
          <div className="mobile-nav-wrap flex col">
            <h3>Nav</h3>
            {links}
          </div>
        </Modal>
      )}
    </>
  );
}
