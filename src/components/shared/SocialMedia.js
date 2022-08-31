import { useState } from "react";
import { Link } from "react-router-dom";
import { socialMedia } from "../../services/other";

export default function SocialMedia() {
  const [current, setCurrent] = useState(socialMedia[0]);

  return (
    <div className="sm-cache">
      <div className="sm-list">
        {socialMedia.map((entry, index) => {
          const { name, link } = entry;
          return (
            <a
              key={index}
              href={link}
              target='_blank'
              onMouseEnter={() => setCurrent(entry)}
              // onMouseLeave={() => console.log("hi")}
            >
              <svg className="sm-icon">
                <use
                  href={`#${
                    name === "GitHub"
                      ? "github-logo"
                      : name === "LinkedIn"
                      ? "linkedin-logo"
                      : name === "Instagram"
                      ? "ig-logo"
                      : ""
                  }`}
                />
              </svg>
            </a>
          );
        })}
      </div>
      <div className="sm-handler">{current.handler}</div>
    </div>
  );
}
