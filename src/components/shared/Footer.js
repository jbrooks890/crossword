import { Link } from "react-router-dom";
import Icons from "./Icons";
import SocialMedia from "./SocialMedia";

export default function Footer() {
  return (
    <footer>
      <svg className="jb-logo">
        <use href="#jb-logo" />
      </svg>
      <SocialMedia />
      <Icons />
    </footer>
  );
}
