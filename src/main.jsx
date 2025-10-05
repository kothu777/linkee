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
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 1000 * 60 * 5, 
              cacheTime: 1000 * 60 * 10,
              retry: 2,
            },
          },
        })
      }
    >
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
