import axios from "axios";
// !========================= git all posts ===========================================
export async function getAllPostsAPI(page = 1, limit = 20) {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/posts`;
    const { data } = await axios.get(API, {
      headers: {
        token: localStorage.getItem("token"),
      },
      params: {
        page,
        limit,
        sort: "-createdAt",
      },
    });
    return data;
  } catch (error) {
    console.error("Error in fetching posts:", error);
    throw error;
  }
}

// !========================= git single post ===========================================
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

// !========================= create post ===========================================
export async function addPost(data) {
  try {
    const formData = new FormData();
    if (data.textAreaBody) {
      formData.append("body", data.textAreaBody);
    }
    if (data.imgFile) {
      formData.append("image", data.imgFile);
    }
    const API = `${import.meta.env.VITE_BASE_URL}/posts`;
    const res = await axios.post(API, formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    return res;
  } catch (error) {
    console.error("Error in Creating the post:", error);
    return error;
  }
}

// !========================= Delete a post ===========================================
export async function deletePostsAPI(id) {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/posts/${id}`;
    const { data } = await axios.delete(API, {
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
// !========================= git all posts ===========================================
export async function updatePost(postId, updatedData) {
  try {
    const formData = new FormData();
    
    // Always append body content (required field)
    formData.append("body", updatedData.textAreaBody || "");
    
    if (updatedData.imgFile) {
      // User uploaded a new image
      formData.append("image", updatedData.imgFile);
    }
    const API = `${import.meta.env.VITE_BASE_URL}/posts/${postId}`;
    const res = await axios.put(API, formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    return res;
  } catch (error) {
    console.error("Error in Updating the post:", error);
    return error;
  }
}
