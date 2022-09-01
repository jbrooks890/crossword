import Comment from "./Comment";

export default function CommentList({ comments, editComment, deleteComment }) {
  return (
    <ul id="comment-list">
      {comments.map(comment => (
        <Comment
          key={comment._id}
          entry={comment}
          editComment={editComment}
          deleteComment={deleteComment}
        />
      ))}
    </ul>
  );
}
