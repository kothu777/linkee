import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "../components/Navbar";
export default function AuthLayout() {
  return (
    <div className="">
      <AppNavbar />
      <Outlet />
    </div>
  );
}
