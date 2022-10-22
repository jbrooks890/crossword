// import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo.svg";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";
import "../../styles/Header.css";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <h2 id="site-logo" className="flex" onClick={() => navigate("/")}>
        <XWORD_LOGO />
      </h2>
      <Nav />
    </header>
  );
}
