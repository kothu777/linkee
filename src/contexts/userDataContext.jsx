import { getLoggedUserAPI } from "@/Services/userServices";
import { createContext, useEffect, useState } from "react";
const UserDataContext = createContext({
  userData: null,
  setUserData: () => {},
});
export { UserDataContext };
export default function UserDataContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  async function fetchUserData() {
    try {
      const { user } = await getLoggedUserAPI();
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // If fetching user data fails (e.g., token expired), clear the token
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUserData(null);
      }
    }
  }
  
  // Watch for token changes and fetch user data accordingly
  useEffect(() => {
    if(token){
      fetchUserData();
    }else{
      setUserData(null);
    }
  }, [token]);
  
  // Sync with localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return (
    <UserDataContext.Provider value={{ userData, setUserData, setToken }}>
      {children}
    </UserDataContext.Provider>
  );
}
