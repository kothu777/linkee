import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { scheme } from "@/Schemas/changePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { changePasswordAPI } from "@/Services/userServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function ChangePassModal({ isOpen, onOpenChange }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
    resolver: zodResolver(scheme),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // TODO:======== API call ========
      await changePasswordAPI(data.password, data.newPassword);

      toast.success("Password changed successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });

      reset();
      onOpenChange(false);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to change password. Please try again.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (onClose) => {
    reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change Password
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                id="change-password-form"
              >
                <Input
                  isRequired
                  type={showCurrentPassword ? "text" : "password"}
                  label="Current Password"
                  variant="faded"
                  radius="lg"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "shadow-sm hover:shadow-md transition-shadow",
                  }}
                  endContent={
                    <button
                      type="button"
                      aria-label={
                        showCurrentPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowCurrentPassword((v) => !v)} // FIX: Use dedicated toggle
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                    >
                      <i
                        className={`fa-solid ${
                          showCurrentPassword ? "fa-eye" : "fa-eye-slash"
                        }`}
                      ></i>
                    </button>
                  }
                  {...register("password")}
                  isInvalid={Boolean(errors?.password?.message)}
                  errorMessage={errors.password?.message}
                  isDisabled={isSubmitting}
                />
                <Input
                  isRequired
                  type={showNewPassword ? "text" : "password"}
                  label="New Password"
                  variant="faded"
                  radius="lg"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "shadow-sm hover:shadow-md transition-shadow",
                  }}
                  endContent={
                    <button
                      type="button"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                    >
                      <i
                        className={`fa-solid ${
                          showNewPassword ? "fa-eye" : "fa-eye-slash"
                        }`}
                      ></i>
                    </button>
                  }
                  {...register("newPassword")}
                  isInvalid={Boolean(errors?.newPassword?.message)}
                  errorMessage={errors.newPassword?.message}
                  isDisabled={isSubmitting}
                />
                <Input
                  isRequired
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm New Password"
                  variant="faded"
                  radius="lg"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "shadow-sm hover:shadow-md transition-shadow",
                  }}
                  endContent={
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                    >
                      <i
                        className={`fa-solid ${
                          showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                        }`}
                      ></i>
                    </button>
                  }
                  {...register("confirmNewPassword")}
                  isInvalid={Boolean(errors?.confirmNewPassword?.message)}
                  errorMessage={errors.confirmNewPassword?.message}
                  isDisabled={isSubmitting}
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="ghost"
                onPress={() => handleClose(onClose)}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="shadow"
                type="submit"
                form="change-password-form"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                {isSubmitting ? "Changing..." : "Change Password"}{" "}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
