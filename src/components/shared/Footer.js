import { Link } from "react-router-dom";
import "../../styles/Footer.css"
import Icons from "./Icons";
import SocialMedia from "./SocialMedia";
import {ReactComponent as MainGradient} from "../Gradients.svg"

export default function Footer() {
  return (
    <footer>
      <svg className="jb-logo">
        <use href="#jb-logo" />
      </svg>
      <SocialMedia />
      <span className="copyright">
        &copy;{new Date().getFullYear()} Julian Brooks. All rights reserved.
      </span>
      <Icons />
      <MainGradient />
    </footer>
  );
}
