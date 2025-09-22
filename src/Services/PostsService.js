import axios from "axios";

export async function getAllPostsAPI(page = 1, limit = 10) {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/posts`;
    const { data } = await axios.get(API, {
      headers: {
        token: localStorage.getItem("token"),
      },
      params: {
        page,
        limit,
      },
    });
    return data;
  } catch (error) {
    console.error("Error in fetching posts:", error);
    throw error;
  }
}
export async function getSinglePostsAPI(id) {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/posts/${id}`;
    const { data } = await axios.get(API, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
