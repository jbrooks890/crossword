import { useState } from "react";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

export default function useModal() {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => setIsShowing(prev => !prev);

  return {
    isShowing,
    toggle,
  };
}
