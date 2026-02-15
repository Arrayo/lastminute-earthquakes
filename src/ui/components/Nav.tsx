import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Map" },
  { to: "/sources", label: "Sources" },
  { to: "/methodology", label: "Methodology" },
] as const;

export function Nav() {
  return (
    <nav className="nav" aria-label="Main navigation">
      <ul className="nav__list">
        {links.map(({ to, label }) => (
          <li key={to} className="nav__item">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav__link${isActive ? " nav__link--active" : ""}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
