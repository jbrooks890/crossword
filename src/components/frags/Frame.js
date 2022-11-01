import CommunityCache from "./CommunityCache";

export default function Frame({ children, puzzle, submit, setFormActive }) {
  const { name, editorMode } = puzzle;
  const { active: editing, phase } = editorMode;
  // console.log(Boolean(name));

  return (
    <form id="crossword" onSubmit={submit}>
      {(!editing || phase > 0) && (
        <>
          <h1
            className={`puzzle-title ${editing ? "editable" : ""}`}
            onClick={() => (editing ? setFormActive(true) : null)}
          >
            {name ? name : editing ? "New Puzzle" : ""}
          </h1>
          {/* {!editing && <CommunityCache />} */}
        </>
      )}
      {children}
    </form>
  );
}
