import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav>
      <NavLink to="/">Play</NavLink>
      <NavLink to="/build">Build</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
}
