import React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "@/contexts/userDataContext.jsx";
import { Button, Divider, Image, useDisclosure } from "@heroui/react";
import ProfileImageModal from "@/components/ProfileImageModal";
import SpinnerComponent from "@/components/SpinnerComponent";
import { toast } from "react-toastify";
import ChangePassModal from "@/components/ChangePassModal";
import { EditIcon } from "@/components/icons/EditIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";

export default function Profile() {
  const navigate = useNavigate();
  const {
    isOpen: isImgUploadOpen,
    onOpen: onImgUploadOpen,
    onOpenChange: onOpenImgUploadChange,
  } = useDisclosure();
  const {
    isOpen: isChangePassOpen,
    onOpen: onChangePassOpen,
    onOpenChange: onOpenChangePassChange,
  } = useDisclosure();
  const { userData, setUserData, refreshUserData } =
    useContext(UserDataContext);
  const [imageKey, setImageKey] = useState(Date.now());

  // FIX: Handle image update with multiple strategies
  async function handleImageUpdated(newImageUrl) {
    // Strategy 1: Update context immediately for instant UI update
    setUserData((prev) => ({
      ...prev,
      photo: newImageUrl,
    }));

    // Strategy 2: Force image re-render
    setImageKey(Date.now());

    // Strategy 3: Refresh user data from server to ensure sync
    // This ensures the image URL is correct if server returns different URL
    try {
      await refreshUserData();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      toast.error("Failed to refresh user data. Please try again.");
    }
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerComponent />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <article className="p-6 bg-white dark:bg-gray-800 rounded-lg drop-shadow-xl w-full max-w-2xl">
        {/* Back button */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={() => navigate("/")}
          className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Back to feed"
        >
          <ArrowRightIcon className="w-5 h-5 rotate-180 text-gray-700 dark:text-gray-200" />
        </Button>
        
        <header className="flex justify-start items-center gap-4">
          <div className="relative">
            <Image
              key={imageKey}
              className="rounded-full mb-2 object-cover"
              alt="User profile image"
              src={userData.photo}
              width={110}
              height={110}
            />
            <Button
              onPress={onImgUploadOpen}
              isIconOnly
              size="sm"
              className="absolute z-20 right-0 bottom-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              aria-label="Edit profile image"
            >
              <EditIcon className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </Button>
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-2xl text-slate-900 dark:text-gray-50 font-bold">
              {userData.name}
            </h1>
            <p className="text-gray-600/75 text-sm dark:text-gray-300">
              {userData.email}
            </p>
          </div>
        </header>
        <Divider className="my-4" />
        <section className="mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50">
              Date of birth
            </h2>
            <p className="text-gray-600/90 dark:text-gray-300">
              {new Date(userData.dateOfBirth).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <Divider className="my-3 w-11/12 mx-auto" />
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50">
              Joined Date
            </h2>
            <p className="text-gray-600/90 dark:text-gray-300">
              {new Date(userData.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <Divider className="my-3 w-11/12 mx-auto" />
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50">
              Gender
            </h2>
            <p className="text-gray-600/90 dark:text-gray-300">
              {userData.gender.charAt(0).toUpperCase() +
                userData.gender.slice(1) || "Not specified"}
            </p>
          </div>
          <Divider className="my-3 w-11/12 mx-auto" />
          <Button variant="ghost" color="danger" onPress={onChangePassOpen}>
            Change Password
          </Button>
        </section>
      </article>
      <ProfileImageModal
        isOpen={isImgUploadOpen}
        currentImage={userData.photo}
        onOpenChange={onOpenImgUploadChange}
        onImageUpdated={handleImageUpdated}
      />
      <ChangePassModal
        isOpen={isChangePassOpen}
        onOpenChange={onOpenChangePassChange}
      />
    </div>
  );
}
