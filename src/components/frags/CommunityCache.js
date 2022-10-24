import "../../styles/CommunityCache.css";

export default function CommunityCache() {
  return (
    <div className="community-cache flex center">
      <button className="like-button empty" onClick={e => e.preventDefault()}>
        <svg>
          <use href="#like-icon" />
        </svg>
      </button>
      <button className="comment-button" onClick={e => e.preventDefault()}>
        <svg>
          <use href="#dialog-icon" />
        </svg>
      </button>
    </div>
  );
}
