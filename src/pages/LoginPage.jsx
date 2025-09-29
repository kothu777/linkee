import { schema } from "../Schemas/loginSchema";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../Services/authServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import  { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { UserDataContext } from "../contexts/userDataContext";
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  
  // Context hooks for updating auth state
  const { setIsLoggedIn } = useContext(AuthContext);
  const { setToken } = useContext(UserDataContext);
  // *--------------Start of the useForm hook ------------------
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  // ?-------- handleLogin function ------------------
  const handleLogin = async (data) => {
    try {
      setIsLoading(true);
      setAuthError(""); // Clear any previous auth errors
      let res = await loginUser(data);
      // Store token if available
      if (res?.token) {
        localStorage.setItem("token", res.token);
        // Update context states to trigger user data fetch
        setToken(res.token);
        setIsLoggedIn(true);
      }

      toast.success("Signin successful!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Redirect to home page after showing toast
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);

      // Handle specific error cases
      let errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        error?.response?.data?.message ||
        "Signin failed. Please try again.";

      // Set auth error for form display
      setAuthError(errorMessage);

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur-sm py-8 px-8 shadow-2xl rounded-2xl border border-white/50">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="flex flex-col gap-5">
            <Input
              isRequired
              type="email"
              label="Email Address"
              variant="faded"
              radius="lg"
              classNames={{
                input: "text-sm",
                inputWrapper: "shadow-sm hover:shadow-md transition-shadow",
              }}
              {...register("email")}
              isInvalid={Boolean(errors?.email?.message)}
              errorMessage={errors.email?.message}
            />

            <Input
              isRequired
              type="password"
              label="Password"
              variant="faded"
              radius="lg"
              classNames={{
                input: "text-sm",
                inputWrapper: "shadow-sm hover:shadow-md transition-shadow",
              }}
              {...register("password")}
              isInvalid={Boolean(errors?.password?.message)}
              errorMessage={errors.password?.message}
            />

            {/* Authentication Error Display */}
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                <p className="text-red-600 text-sm font-medium">{authError}</p>
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              variant="shadow"
              size="lg"
              radius="lg"
              className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-semibold transition-all duration-300 transform hover:scale-105"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              replace
              className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
