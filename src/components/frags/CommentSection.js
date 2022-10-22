import { useEffect, useState } from "react";
import "../../styles/Comments.css";
import CommentList from "./CommentList";
import CommentNew from "./CommentNew";
import axios from "axios";
import apiUrl from "../../config";

export default function CommentSection({ comments, owner }) {
  const [allComments, setAllComments] = useState(comments);
  const [modified, setModified] = useState(false);

  // :::::::::::: COMMENT HANDLERS ::::::::::::

  // ----------- ADD COMMENT ----------
  const addComment = newComment => {
    axios({
      url: `${apiUrl}/comments`,
      method: "POST",
      data: { ...newComment, owner },
    })
      .then(res => {
        setAllComments(prev => [...prev, res.data.comment]);
        // setModified(true);
      })
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
      .then(
        setAllComments(prev => {
          const revised = [...prev];
          const edited = revised.indexOf(
            revised.find(comment => comment._id === id)
          );
          revised.splice(edited, 1, comment);
          return revised;
        })
      )
      .catch(console.error);
  };

  // ----------- DELETE COMMENT ----------
  const deleteComment = id => {
    // e.preventDefault();
    axios({
      url: `${apiUrl}/comments/${id}`,
      method: "DELETE",
    })
      .then(
        setAllComments(prev => {
          const revised = [...prev];
          const deleted = revised.indexOf(
            revised.find(comment => comment._id === id)
          );
          revised.splice(deleted, 1);
          return revised;
        })
      )
      .catch(console.error);
  };

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div id="comment-section">
      <CommentNew add={e => addComment(e)} />
      <CommentList
        comments={allComments}
        editComment={editComment}
        deleteComment={deleteComment}
      />
    </div>
  );
}
