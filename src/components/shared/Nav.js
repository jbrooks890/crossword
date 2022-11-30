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

  // console.clear();

  const $LINKS = new Map([
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
            classList: ["login"],
            state: { from: location },
          },
        ]
      : [
          auth.username,
          [
            [
              "$",
              {
                // to: "/dashboard",
                classList: ["login"],
              },
            ], // DEFAULT
            ["Dashboard", "/dashboard"], // "$" use the default link'
            ["Logout", { button: { onClick: logout } }],
          ],
        ],
  ]);

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
        const linkRoot = submenu.get("$");
        const defTo = linkRoot?.to ?? linkRoot ?? [...submenu.values()][1];

        return (
          <div className="submenu-wrap">
            <NavLink
              key={display}
              {...(typeof linkRoot === "object" && {
                ...linkRoot,
                className: linkRoot.classList?.join(" "),
              })}
              to={defTo}
            >
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
          <NavLink
            key={display}
            {...{ ...destination, className: destination.classList.join(" ") }}
          >
            {display}
          </NavLink>
        );
      }
    });
  };

  // console.log("nav object:\n", buildNav($LINKS));

  return <nav className="flex middle">{buildNav($LINKS)}</nav>;
}
