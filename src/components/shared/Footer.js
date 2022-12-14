import { Link } from "react-router-dom";
import "../../styles/Footer.css";
import Icons from "./Icons";
import SocialMedia from "./SocialMedia";

export default function Footer() {
  return (
    <footer>
      <svg className="jb-logo">
        <use href="#jb-logo" />
      </svg>
      <SocialMedia />
      <span className="copyright">
        &copy;{new Date().getFullYear()} <strong>XWord</strong>. Designed and
        developed by Julian Brooks. All rights reserved.
      </span>
      <Icons />
    </footer>
  );
}
