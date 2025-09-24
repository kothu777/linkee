import axios from "axios";

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
