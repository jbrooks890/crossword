export default function Frame({ children, puzzle }) {
  return (
    <form id="crossword">
      {puzzle.name && <h1 className="puzzle-title">{puzzle.name}</h1>}
      {children}
    </form>
  );
}
