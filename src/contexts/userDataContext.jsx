import { getLoggedUserAPI } from "@/Services/userServices";
import { createContext, useEffect, useState } from "react";
const UserDataContext = createContext({
  userData: null,
  setUserData: () => {},
});
export { UserDataContext };
export default function UserDataContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  async function fetchUserData() {
    try {
      const { user } = await getLoggedUserAPI();
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
