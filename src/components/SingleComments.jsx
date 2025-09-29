import { useContext, useState } from "react";
import { useTimeAgo } from "../hooks/useTimeAgo";
import { Image, useDisclosure } from "@heroui/react";
import { UserDataContext } from "@/contexts/userDataContext";
import DropDownComponent from "./DropDownComponent";
import DeleteModalComponent from "./DeleteModalComponent";
import { toast } from "react-toastify";
import { DeleteCommentAPI } from "@/Services/commentServices";

export default function SingleComments({ comment, postOwnerId, onCommentDeleted }) {
  const [isLikedComment, setIsLikedComment] = useState(false);
  const [isPingingComment, setIsPingingComment] = useState(false);
  const [isCommentDeleting, setIsCommentDeleting] = useState(false);
  const formatTimeAgo = useTimeAgo();
  const { userData } = useContext(UserDataContext);
  const isCommentByLoggedUser = userData?._id === comment?.commentCreator?._id;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Handle delete comment function
  const handleDeleteComment = async (commentId, onClose) => {
    try {
      setIsCommentDeleting(true);
      
      // TEMPORARY FIX: Client-side validation due to backend API issue
      // Check if user owns the comment
      const isCommentOwner = userData?._id === comment?.commentCreator?._id;
      
      // Check if user owns the post (required for the temporary workaround)
      const isPostOwner = userData?._id === postOwnerId;
      
      if (!isCommentOwner) {
        throw new Error("UNAUTHORIZED: You can only delete your own comments.");
      }
      
      if (!isPostOwner) {
        throw new Error("FORBIDDEN: You can only delete comments on your own posts due to a temporary backend limitation.");
      }
      
      // Proceed with API call only if validations pass
      const res = await DeleteCommentAPI(commentId);
      if (res?.message === "success") {
        onCommentDeleted && await onCommentDeleted();
        toast.success("Comment deleted successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
        });
        onClose();
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      
      let errorMessage;
      if (err.message?.includes("UNAUTHORIZED")) {
        errorMessage = "You can only delete your own comments.";
      } else if (err.message?.includes("FORBIDDEN")) {
        errorMessage = "You can only delete comments on your own posts due to a temporary backend limitation.";
      } else if (err.response?.status === 401) {
        errorMessage = "You can only delete your own comments.";
      } else {
        errorMessage = "Failed to delete comment. Please try again.";
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000, // Longer duration for detailed error messages
        hideProgressBar: false,
      });
    } finally {
      setIsCommentDeleting(false);
    }
  };

  // Handle update comment function
  const handleUpdateComment = (commentId) => {
    console.log(`Update comment with ID: ${commentId}`);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          <Image
            alt="user avatar"
            className="rounded-full"
            src="https://linked-posts.routemisr.com/uploads/default-profile.png"
            height={40}
            width={40}
          />
          <div className="flex flex-col">
            <h1 className="inline-block text-base font-bold mr-2">
              {comment?.commentCreator?.name}
            </h1>
            <small className="text-slate-500 text-xs dark:text-slate-300">
              {formatTimeAgo(comment?.createdAt || new Date().toISOString())}
            </small>
          </div>

          {isCommentByLoggedUser && (
            <DropDownComponent
              handleUpdatePost={handleUpdateComment}
              onOpen={onOpen}
              deletedComponent={comment}
              type={"comment"}
            />
          )}
        </div>
        <div className="media-body">
          <p>{comment?.content}</p>

          <div
            className="cursor-pointer py-3 "
            onClick={(e) => {
              e.preventDefault();
              setIsLikedComment((prev) => !prev);
              setIsPingingComment(true);
              setTimeout(() => setIsPingingComment(false), 700);
            }}
          >
            <span>
              <svg
                className={`${
                  isLikedComment
                    ? "fill-rose-600 dark:fill-rose-400 transition-all duration-300"
                    : "fill-slate-500 dark:fill-slate-300"
                } ${isPingingComment ? "animate-ping" : ""}`}
                style={{ width: 22, height: 22 }}
                viewBox="0 0 24 24"
              >
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
      <DeleteModalComponent
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDeleting={isCommentDeleting}
        handleDelete={handleDeleteComment}
        deletedComponent={comment}
        type={"comment"}
      />
    </>
  );
}
