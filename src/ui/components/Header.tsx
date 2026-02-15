import { Link } from "react-router-dom";
import { APP_NAME } from "../../config/constants.ts";
import { Nav } from "./Nav.tsx";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          {APP_NAME}
        </Link>
        <Nav />
      </div>
    </header>
  );
}
