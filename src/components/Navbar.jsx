import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import React, { useContext, useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

export const LinkeeLogo = () => {
  return <img src={logo} alt="logo" className="w-9 h-9" />;
};

export default function AppNavbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Navbar className="shadow bg-slate-100">
      <NavbarBrand>
        <Link href="/">
          <LinkeeLogo />
          <p className="font-bold text-blue-500 text-3xl ms-2">LINKEE</p>
        </Link>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        {!isLoggedIn ? (
          <>
            <NavbarItem>
              <Button
                color="default"
                onPress={() => navigate("/login")}
                variant="flat"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                color="primary"
                onPress={() => navigate("/register")}
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) : (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-all duration-300 cursor-pointer"
                color="primary"
                name="User"
                size="md"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat" >
              <DropdownItem key="profile" className="h-14 gap-2 mb-1 bg-blue-50">
                <p className="font-semibold text-gray-600">Signed in as</p>
                <p className="font-bold text-blue-600">user@linkee.com</p>
              </DropdownItem>
              <DropdownItem key="settings" onPress={() => navigate("/profile")}>
                My Profile
              </DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="border my-1 border-red-700 bg-red-500 text-white text-center hover:!bg-red-500/80 hover:!font-bold hover:!text-white transition-all duration-300"
                onPress={handleLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
}
