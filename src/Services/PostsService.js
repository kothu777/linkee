import axios from "axios";

export async function getAllPostsAPI() {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/posts?limit=0`;
    const { data } = await axios.get(API, {
        headers:{
            token: localStorage.getItem("token")
        }
    });
    return data;
  } catch (error) {
    console.error("Error in fetching posts:", error);
    throw error;
  }
}