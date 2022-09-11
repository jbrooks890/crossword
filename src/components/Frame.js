export default function Frame({ children, puzzle, submit }) {
  const { active, phase } = puzzle.editorMode;

  return (
    <form id="crossword" onSubmit={submit}>
      {(!active || phase > 0) && puzzle.name && (
        <h1 className={`puzzle-title ${active ? "editable" : ""}`}>
          {puzzle.name}
        </h1>
      )}
      {children}
    </form>
  );
}
