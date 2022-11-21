import "../../styles/BuildWindow.css";
import { useState } from "react";

export default function BuildWindow({ children }) {
  const sections = children.map(child => child.props.section);
  const [activeSection, setActiveSection] = useState(sections.indexOf("Words"));
  // console.log(sections);

  const changeSection = (e, index) => {
    e.preventDefault();
    setActiveSection(index);
  };

  return (
    <div className="build-window-wrap flex col">
      <div className="build-window-section-cache flex">
        {sections.map((section, i) => (
          <button
            key={i}
            className={i === activeSection ? "active" : "inactive"}
            onClick={e => changeSection(e, i)}
          >
            {section}
          </button>
        ))}
      </div>
      <div className="build-window flex col">
        {children.map((child, i) => (
          <div
            key={i}
            className={`flex col ${i === activeSection ? "active" : ""}`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
