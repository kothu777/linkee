import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {HeroUIProvider} from "@heroui/react";
import AuthContextProvider from "./contexts/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <HeroUIProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </HeroUIProvider>
);
