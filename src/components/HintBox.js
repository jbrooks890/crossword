import { useState } from "react";

export default function HintBox({ hint }) {
  const [sticky, setSticky] = useState(true);

  return (
    <div
      id="hint-box"
      className={sticky ? "sticky" : ""}
      onDoubleClick={() => setSticky(prev => !prev)}
    >
      {hint}
    </div>
  );
}
