
import { Divider } from "@heroui/react";
import SingleComments from "./SingleComments";

export default function Comment({ comments, commentsLimit = 2, postOwnerId, onCommentDeleted }) {
  // !============ handle add comment function   ============!

  return (
    <>
      {comments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
        .slice(0, commentsLimit) 
        .map((comment, index) => {
          return (
            <div key={comment._id} className="comment flex flex-col gap-1">
              <SingleComments comment={comment} postOwnerId={postOwnerId} onCommentDeleted={onCommentDeleted} />
              {index + 1 !== commentsLimit && (
                <Divider className="mb-3 w-4/5 mx-auto bg-slate-200 dark:bg-slate-700" />
              )}
            </div>
          );
        })}
    </>
  );
}