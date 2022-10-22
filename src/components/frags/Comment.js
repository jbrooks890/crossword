import { useState } from "react";

export default function Comment({ entry, editComment, deleteComment }) {
  const [editing, setEditing] = useState({ active: false, comment: entry });
  const { user, content, postDate } = entry;
  const { name, type } = user;
  const { _id } = entry;

  // console.log(entry);
  const handleChange = e => {
    const { name, value } = e.target;
    setEditing(prev => ({
      ...prev,
      comment: { ...prev.comment, [name]: value },
    }));
  };

  // editing.active && console.log(editing.comment.content);

  return (
    <li className="comment-entry">
      <h3 className="comment-author">{name}</h3>
      {!editing.active ? (
        <p className="comment-content">{content}</p>
      ) : (
        <form
          className="edit-comment"
          onSubmit={e => {
            // e.preventDefault();
            editComment(e, _id, editing.comment);
            setEditing(prev => ({ ...prev, active: false }));
          }}
        >
          <textarea
            className="edit-comment-box"
            name="content"
            defaultValue={content}
            onChange={e => handleChange(e)}
          />
          <button>Confirm</button>
        </form>
      )}
      {!editing.active && (
        <div className="comment-button-cache">
          {/* <button>Like</button> */}
          <button
            onClick={() => setEditing(prev => ({ ...prev, active: true }))}
          >
            Edit
          </button>
          <button onClick={() => deleteComment(_id)}>Delete</button>
        </div>
      )}
    </li>
  );
}
