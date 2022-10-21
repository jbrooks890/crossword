// import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo.svg";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";
import "../../styles/Header.css"
import Nav from "./Nav";

export default function Header() {
  return (
    <header>
      <h2 id="site-logo" className="flex">
        <XWORD_LOGO />
      </h2>
      <Nav />
    </header>
  );
}
