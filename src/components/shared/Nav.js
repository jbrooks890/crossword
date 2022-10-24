import { NavLink } from "react-router-dom";
import "../../styles/Nav.css";
import useMediaQuery from "../../hooks/useMediaQuery";
import MobileNav from "./MobileNav";

export default function Nav() {
  const $MOBILE = useMediaQuery();
  const links = Array.from(
    new Map([
      ["Play", "/"],
      ["Build", "/build"],
      ["About", "/about"],
    ])
  ).map(([title, path]) => (
    <NavLink key={title.toLowerCase()} to={path}>
      {title}
    </NavLink>
  ));

  return <nav>{$MOBILE ? <MobileNav links={links} /> : links}</nav>;
}
