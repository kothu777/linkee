import axios from "axios";
// !============== Add a Comment API ==============! //
export async function addComment(postId, commentData) {
  const token = localStorage.getItem("token");

  const API = `${import.meta.env.VITE_BASE_URL}/comments`;
  const response = await axios.post(
    API,
    {
      content: commentData,
      post: postId,
    },
    {
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

// !============== Delete a Comment API ==============! //
export async function DeleteCommentAPI(commentId) {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/comments/${commentId}`;
    const { data } = await axios.delete(API, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}
// !============== Update a Comment API ==============! //
export async function updateComment(commentId, content) {
  const token = localStorage.getItem("token");

  const API = `${import.meta.env.VITE_BASE_URL}/comments/${commentId}`;
  const response = await axios.put(
    API,
    {
      content: content,
    },
    {
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
