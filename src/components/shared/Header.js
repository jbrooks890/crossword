import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo.svg";
import Nav from "./Nav";

export default function Header() {
  return (
    <header>
      <h2 id="site-logo">
        <XWORD_LOGO />
      </h2>
      <Nav />
    </header>
  );
}
