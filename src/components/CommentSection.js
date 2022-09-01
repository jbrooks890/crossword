import { useState } from "react";
import CommentList from "./CommentList";
import CommentNew from "./CommentNew";
import axios from "axios";
import apiUrl from "../config";

export default function CommentSection({ comments, owner }) {
  const [allComments, setAllComments] = useState(comments);
  const [modified, setModified] = useState(false);

  // :::::::::::: COMMENT HANDLERS ::::::::::::

  // ----------- ADD COMMENT ----------
  const addComment = newComment => {
    // e.preventDefault();
    console.log(newComment);
    axios({
      url: `${apiUrl}/comments`,
      method: "POST",
      data: { ...newComment, owner },
    })
      .then(res => setAllComments(prev => [...prev, res.data.comment]))
      .catch(console.error);
  };

  // ----------- EDIT COMMENT ----------
  const editComment = (e, id, comment) => {
    e.preventDefault();
    axios({
      url: `${apiUrl}/comments/${id}`,
      method: "PUT",
      data: comment,
    })
      .then(setModified(true))
      .catch(console.error);
  };

  // ----------- DELETE COMMENT ----------
  const deleteComment = id => {
    // e.preventDefault();
    axios({
      url: `${apiUrl}/comments/${id}`,
      method: "DELETE",
    })
      .then(setModified(true))
      .catch(console.error);
  };

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div id="comment-section">
      <CommentNew add={e => addComment(e)} />
      <CommentList
        comments={comments}
        editComment={editComment}
        deleteComment={deleteComment}
      />
    </div>
  );
}
