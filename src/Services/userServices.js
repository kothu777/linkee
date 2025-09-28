// !============= Get logged user data by token =============//
import axios from "axios";
export async function getLoggedUserAPI() {
    try{
        const API = `${import.meta.env.VITE_BASE_URL}/users/profile-data`;
        const token = localStorage.getItem("token");
        const {data} = await axios.get(API, {
            headers: {
                token: token,
            }
        });
        return data;
    }catch(error){
        console.error("Get logged user error:", error);
        throw error;
    }
}