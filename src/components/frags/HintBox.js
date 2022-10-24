import { useState } from "react";
import "../../styles/HintBox.css";

export default function HintBox({ hint, toggleCache }) {
  const [sticky, setSticky] = useState(true);

  return (
    <div id="hint-box-wrap" className={sticky ? "sticky" : ""}>
      <div
        id="hint-box"
        onClick={toggleCache}
        onDoubleClick={() => setSticky(prev => !prev)}
        data-hint-full={hint}
      >
        {hint}
      </div>
    </div>
  );
}
