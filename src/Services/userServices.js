// !============= Get logged user data by token =============//
import axios from "axios";
export async function getLoggedUserAPI() {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/users/profile-data`;
    const token = localStorage.getItem("token");
    const { data } = await axios.get(API, {
      headers: {
        token: token,
      },
    });
    return data;
  } catch (error) {
    console.error("Get logged user error:", error);
    throw error;
  }
}
// !=================== Change the user profile image ========================//
export async function profileImageAPI(photoFile) {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/users/upload-photo`;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("photo", photoFile);
    const { data } = await axios.put(API, formData, {
      headers: {
        token: token,
      },
    });
    return data;
  } catch (error) {
    console.error("Error in uploading the profile image:", error);
    throw error;
  }
}
// !=================== Change Password ========================//
export async function changePasswordAPI(oldPassword, newPassword) {
  try {
    const API = `${import.meta.env.VITE_BASE_URL}/users/change-password`;
    const token = localStorage.getItem("token");
    const { data } = await axios.patch(
      API,
      {
        password: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: {
          token: token,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error in changing the password:", error);
    throw error;
  }
}
