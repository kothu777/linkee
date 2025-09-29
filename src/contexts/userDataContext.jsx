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
    }
  }
  useEffect(() => {
    if(token){
      fetchUserData();
    }else{
      setUserData(null);
    }
  }, [token]);
  return (
    <UserDataContext.Provider value={{ userData, setUserData, setToken }}>
      {children}
    </UserDataContext.Provider>
  );
}
