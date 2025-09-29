import { Button, Input } from "@heroui/react";
import { useState, useContext } from "react";
import { addComment } from "../Services/commentServices";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { parseErrorResponse, getErrorMessage } from "../utils/errorHandler";

export default function AddCommentField({ postId, onCommentAdded = null }) {
  const [commentContent, setCommentContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-md">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Please log in to add a comment</p>
          <Button 
            color="primary" 
            size="sm" 
            onPress={() => navigate("/login", { replace: true })}
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const handleAddComment = async () => {
    // Validate comment content
    if (!commentContent.trim()) {
      setErrorMsg("Comment cannot be empty");
      return;
    }

    if (commentContent.trim().length < 2) {
      setErrorMsg("Comment must be at least 2 characters long");
      return;
    }

    if (commentContent.trim().length > 30) {
      setErrorMsg("Comment must be 30 characters or less");
      return;
    }

    try {
      setIsCommentSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await addComment(postId, commentContent.trim());
      
      setCommentContent("");
      setSuccessMsg("Comment added successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() =>{ setSuccessMsg("")
        navigate(`/post-details/${postId}`, { replace: true });
      }, 1000);
      
      if (onCommentAdded) {
        onCommentAdded(response); // Pass response to parent component
      }
     
    } catch (error) {
      console.error("Error adding comment:", error);
      
      // Parse error using utility function
      const errorDetails = parseErrorResponse(error);
      const userMessage = getErrorMessage(errorDetails);
      
      // Handle auth errors specifically
      if (errorDetails.isAuthError && errorDetails.status === 401) {
        setErrorMsg("Session expired. Redirecting to login...");
        setIsLoggedIn(false); // Update auth context
        localStorage.removeItem("token"); // Clear invalid token
        // Redirect to login after delay
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        // For all other errors (including validation), just show the message
        setErrorMsg(userMessage);
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMsg(""), 5000);
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
          onKeyDown={handleKeyPress}
          type="text"
          placeholder="Write a comment (max 30 characters)"
          disabled={isCommentSubmitting}
          maxLength={30}
          className={commentContent.length > 25 ? "border-yellow-400" : ""}
        />
        
        {/* Character counter */}
        <div className="absolute bottom-0 right-2 text-xs">
          <small className={`${
            commentContent.length == 30 ? "text-red-500 dark:text-red-400" : 
            commentContent.length > 25 ? "text-yellow-500 dark:text-yellow-400" : 
            "text-gray-400 dark:text-slate-500"
          }`}>
            {commentContent.length}/30
          </small>
        </div>
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
        <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm" role="alert">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Success message positioned above the input field */}
      {successMsg && (
        <div className="absolute -top-14 left-0 right-0 z-10">
          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md shadow-sm">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-700 text-sm" role="status">
              {successMsg}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
