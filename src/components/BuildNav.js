export default function BuildNav({ sections, changeSection }) {
  return (
    <ul id="build-nav">
      {sections.map((section, i) => (
        <li key={i} onClick={() => changeSection(i)}>
          {section}
        </li>
      ))}
    </ul>
  );
}
