import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { addComment } from "../Services/commentServices";
import { useNavigate } from "react-router-dom";

export default function AddCommentField({ postId }) {
  const [commentContent, setCommentContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleAddComment = async () => {
    // Validate comment content
    if (!commentContent.trim()) {
      setErrorMsg("Comment cannot be empty");
      return;
    }

    try {
      setIsCommentSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      await addComment(postId, commentContent.trim());
      setCommentContent("");
      setSuccessMsg("Comment added successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/post-details/" + postId);
      }, 2000);
    } catch (error) {
      console.error("Error adding comment:", error);
      setErrorMsg(error?.message || "Failed to add comment. Please try again.");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="relative">
      <Input
        value={commentContent}
        onChange={(e) => {
          setCommentContent(e.target.value);
          if (errorMsg) setErrorMsg("");
          if (successMsg) setSuccessMsg("");
        }}
        onKeyPress={handleKeyPress}
        type="text"
        placeholder="Write a comment"
        disabled={isCommentSubmitting}
        maxLength={500} // Add reasonable character limit
      />
      <Button
        disabled={!commentContent.trim() || isCommentSubmitting}
        isLoading={isCommentSubmitting}
        onPress={handleAddComment}
        variant="transparent"
        className="absolute -right-2 top-1/2 -translate-y-1/2 w-fit"
        size="sm"
      >
        <span className="flex items-center">
          <svg
            className="fill-blue-500 dark:fill-slate-50"
            style={{ width: 24, height: 24 }}
            viewBox="0 0 24 24"
          >
            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </span>
      </Button>

      {errorMsg && (
        <p className="text-red-500 text-sm mt-1" role="alert">
          {errorMsg}
        </p>
      )}

      {successMsg && (
        <p className="text-green-500 text-sm mt-1" role="status">
          {successMsg}
        </p>
      )}
    </div>
  );
}
