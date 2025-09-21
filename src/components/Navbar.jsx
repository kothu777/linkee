import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import React, { useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
// !--------------End of the Imports ------------------
// *=============== Start of the AppNavbar component ===============
export default function AppNavbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
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
    <Navbar>
      <NavbarContent>
        <Link href="/">
          <NavbarBrand>
            <img src={logo} alt="logo" className="w-6 h-6 " />
            <p className="font-bold text-inherit ms-2">LINKEE</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {!isLoggedIn ? (
          <>
            <NavbarItem className="flex">
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
          <NavbarItem>
            <Button
              color="danger"
              onPress={() => handleLogout()}
              variant="flat"
            >
              Sign Out
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
