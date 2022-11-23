import "../../styles/Nav.css";
import useMediaQuery from "../../hooks/useMediaQuery";
import MobileNav from "./MobileNav";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextProvider";
import useLogout from "../../hooks/useLogout";

export default function Nav() {
  const $MOBILE = useMediaQuery();
  const { auth } = useAuth();
  const logout = useLogout();
  const location = useLocation();

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

  return (
    <nav>
      {
        <>
          {$MOBILE ? <MobileNav links={links} /> : links}
          {auth?.username ? (
            <a
              className="login"
              onClick={e => {
                e.preventDefault();
                logout();
              }}
            >
              {auth.username}
            </a>
          ) : (
            <NavLink
              className="login"
              to="/login"
              state={{ from: location }}
              // replace
            >
              Login
            </NavLink>
          )}
        </>
      }
    </nav>
  );
}
