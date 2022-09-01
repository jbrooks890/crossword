import { useState } from "react";

export default function CommentNew({ add }) {
  const [newComment, setNewComment] = useState({
    user: {
      name: "",
      ip_addr: "0.0.0.0/0",
      type: "guest",
    },
    content: "",
    ownerType: "puzzle",
    thread: [],
  });

  const handleChange = e => {
    setNewComment(prev => {
      let user = {};
      if (e.target.name === "name") {
        user = { ...prev.user, name: e.target.value };
        return { ...prev, user };
      } else {
        return { ...prev, [e.target.name]: e.target.value };
      }
    });
  };

  // console.log(newComment);

  return (
    <form
      id="new-comment"
      onSubmit={e => {
        e.preventDefault();
        add(newComment);
      }}
    >
      <div className="comment-input-box">
        <input
          name="name"
          placeholder="Name"
          onChange={e => handleChange(e)}
          required
        />
        <textarea
          name="content"
          rows="2"
          placeholder="New comment"
          onChange={e => handleChange(e)}
          required
        />
      </div>
      <button>Comment</button>
    </form>
  );
}
