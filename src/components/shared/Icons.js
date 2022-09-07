import { ReactComponent as JB_LOGO } from "../../assets/icons/jb-portfolio-logoAsset 3.svg";
import { ReactComponent as IG_LOGO } from "../../assets/icons/ig-logoAsset 5.svg";
import { ReactComponent as LINKEDIN_LOGO } from "../../assets/icons/linked-in-logoAsset 6.svg";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logoAsset 1.svg";
import { ReactComponent as GITHUB_LOGO } from "../../assets/icons/github-logoAsset 7.svg";
import { ReactComponent as RESTART_ICON } from "../../assets/icons/clear-restart.svg";

export default function Icons() {
  return (
    <svg id="icon-cache" style={{ display: "none" }}>
      <JB_LOGO />
      <IG_LOGO />
      <LINKEDIN_LOGO />
      <XWORD_LOGO />
      <GITHUB_LOGO />
      <RESTART_ICON />
    </svg>
  );
}
