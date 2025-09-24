import axios from "axios";

export async function addComment(postId, commentData) {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/comments`;
    const res = await axios.post(
      API,
      {
        content: commentData,
        post: postId,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    return res;
  } catch (error) {
    console.error("Error in adding comment:", error);
    return error;
  }
}
