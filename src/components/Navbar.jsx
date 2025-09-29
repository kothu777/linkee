import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../contexts/authContext";
import { UserDataContext } from "@/contexts/userDataContext";

export const LinkeeLogo = () => {
  return <img src={logo} alt="logo" className="w-9 h-9" />;
};

export default function AppNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { userData, setToken } = useContext(UserDataContext);
  const navigate = useNavigate();

  // Safe localStorage operations
  const getStoredToken = () => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.warn("localStorage not available:", error);
      return null;
    }
  };

  const removeStoredToken = () => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.warn("Failed to remove token from localStorage:", error);
    }
  };

  const handleLogout = () => {
    removeStoredToken();
    setIsLoggedIn(false);
    setToken(null); // Clear user data from context
    navigate("/login", { replace: true });
    onClose(); // Close the modal after logout
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = getStoredToken();
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn, setIsLoggedIn]);

  // Get user email from context or fallback
  const userEmail = userData?.name || "Guest";
  const userName = userData?.email || "guest@example.com";

  return (
    <>
      <Navbar className="shadow bg-slate-100/10 dark:bg-slate-900/80">
        <NavbarBrand>
          <Link to="/" replace className="flex items-center">
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
                  onPress={() => navigate("/login", { replace: true })}
                  variant="flat"
                >
                  Login
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  color="primary"
                  onPress={() => navigate("/register", { replace: true })}
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
                  name={userName}
                  size="md"
                  src={userData?.photo || ""}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2 mb-1 bg-blue-50"
                  textValue={`Signed in as ${userEmail}`}
                >
                  <p className="font-semibold text-gray-600">Signed in as</p>
                  <p className="font-bold text-blue-600">{userEmail}</p>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  onPress={() => navigate("/profile", { replace: true })}
                  textValue="My Profile"
                >
                  My Profile
                </DropdownItem>
                <DropdownItem key="help_and_feedback" textValue="Help & Feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="border my-1 border-red-700 bg-red-500 text-white text-center hover:!bg-red-500/80 hover:!font-bold hover:!text-white transition-all duration-300"
                  onPress={onOpen}
                  textValue="Log Out"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>
      </Navbar>
      {/* Modal to confirm logout */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirm Logout
                </ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to logout?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="success" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="danger" onPress={handleLogout}>
                    Logout
                  </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
