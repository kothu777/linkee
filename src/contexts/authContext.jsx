import { createContext, useState, useEffect } from "react";
import React from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export {AuthContext} ;

export default function AuthContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize auth state after component mounts to avoid hydration issues
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      setIsLoggedIn(token !== null);
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
}
