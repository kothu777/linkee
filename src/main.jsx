import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";
import AuthContextProvider from "./contexts/authContext.jsx";
import UserDataContextProvider from "./contexts/userDataContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <QueryClientProvider client={new QueryClient()}>
      <HeroUIProvider>
        <UserDataContextProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </UserDataContextProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  </AuthContextProvider>
);
