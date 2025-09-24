import { Divider } from "@heroui/react";
import SingleComments from "./SingleComments";

export default function Comment({ comments, commentsLimit = 2 }) {
  // !============ handle add comment function   ============!

  return (
    <>
      {comments.slice(0, commentsLimit).map((comment, index) => {
        return (
          <div key={comment._id} className="comment flex flex-col gap-1">
            <SingleComments comment={comment} />
            {index + 1 !== commentsLimit && (
              <Divider className="mb-3 w-4/5 mx-auto" />
            )}
          </div>
        );
      })}
    </>
  );
}
