export default function Frame({ children, puzzle, submit, setFormActive }) {
  const { active: editing, phase } = puzzle.editorMode;

  return (
    <form id="crossword" onSubmit={submit}>
      {(!editing || phase > 0) && puzzle.name && (
        <h1
          className={`puzzle-title ${editing ? "editable" : ""}`}
          onClick={() => setFormActive(true)}
        >
          {puzzle.name}
        </h1>
      )}
      {children}
    </form>
  );
}
