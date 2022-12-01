import "../../styles/Nav.css";
import useMediaQuery from "../../hooks/useMediaQuery";
import MobileNav from "./MobileNav";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextProvider";
import useLogout from "../../hooks/useLogout";
import { useEffect } from "react";

export default function Nav() {
  const $MOBILE = useMediaQuery();
  const { auth } = useAuth();
  const logout = useLogout();
  const location = useLocation();

  const LINKS = new Map([
    ["Play", "/"],
    ["Build", "/build"],
    [
      "About",
      [
        ["$", "/about"],
        ["Controls", "/about"],
        ["Demo", "/about"],
      ],
    ],
    !auth.username
      ? [
          "Login",
          {
            to: "/login",
            className: "login",
            state: { from: location },
          },
        ]
      : [
          auth.username,
          [
            [
              "$",
              {
                to: "/dashboard",
                className: "login",
              },
            ], // DEFAULT
            ["Dashboard", "/dashboard"], // "$" use the default link'
            ["Logout", { button: { onClick: logout } }],
          ],
        ],
  ]);

  // =========== Build Nav ===========

  const buildNav = nav => {
    // console.log("nav:", nav);
    return [...nav].map(([display, destination]) => {
      if (display === "$") return;
      const type = typeof destination;

      const submenu = Array.isArray(destination) && new Map(destination);
      // submenu && console.table(Object.fromEntries([...submenu]));

      if (type === "string") {
        return (
          <NavLink key={display} to={destination}>
            {display}
          </NavLink>
        );
      } else if (submenu) {
        const root = submenu.get("$");
        const defTo = root?.to ?? root ?? [...submenu.values()][0];
        // console.log({ defTo });

        return (
          <div key={display} className="submenu-wrap">
            <NavLink {...(typeof root === "object" && root)} to={defTo}>
              {display}
            </NavLink>
            <div className="submenu flex col">{buildNav(submenu)}</div>
          </div>
        );
      } else if (type === "object") {
        return destination.button ? (
          <a key={display} {...destination.button}>
            {display}
          </a>
        ) : (
          <NavLink key={display} {...destination}>
            {display}
          </NavLink>
        );
      }
    });
  };

  // useEffect(() => console.log("nav object:\n", buildNav(LINKS)), []);

  const NAV = buildNav(LINKS);

  return (
    <nav className="flex middle">
      {$MOBILE ? <MobileNav links={NAV} /> : NAV}
    </nav>
  );
}
