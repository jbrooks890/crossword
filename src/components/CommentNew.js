import { useEffect, useState } from "react";

export default function CommentNew({ add }) {
  const blank = {
    user: {
      name: "",
      ip_addr: "0.0.0.0/0",
      type: "guest",
    },
    content: "",
    ownerType: "puzzle",
    thread: [],
  };
  const [newComment, setNewComment] = useState(blank);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (added) {
      console.log("Refresh new comment!");
      setNewComment(blank);
      setAdded(false);
    }
  }, [added]);

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
        setAdded(true);
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
      <button>Post</button>
    </form>
  );
}
