import { APP_NAME } from "../../config/constants.ts";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
