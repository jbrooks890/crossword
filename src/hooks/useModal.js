import { useState } from "react";
import useMediaQuery from "./useMediaQuery";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

export default function useModal() {
  const [isShowing, setIsShowing] = useState(false);
  const $MOBILE = useMediaQuery();

  const toggle = (closing = false) => {
    document.body.classList.toggle("modal-lock");
    setIsShowing(prev => !prev);
  };

  return {
    isShowing,
    toggle,
  };
}
