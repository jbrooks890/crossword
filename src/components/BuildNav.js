export default function BuildNav({ sections, active, changeSection }) {
  return (
    <ul id="build-nav">
      {sections.map((section, i) => (
        <li
          key={i}
          className={`build-nav-btn ${active === i ? "active" : ""}`}
          onClick={() => changeSection(i)}
        >
          {section}
        </li>
      ))}
    </ul>
  );
}
