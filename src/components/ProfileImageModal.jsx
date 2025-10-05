import { profileImageAPI } from "@/Services/userServices";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@heroui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { EditIcon } from "@/components/icons/EditIcon";

export default function ProfileImageModal({
  isOpen,
  onOpenChange,
  currentImage,
  onImageUpdated,
}) {
  const [imgPreview, setImgPreview] = useState(currentImage || null);
  const [imgFile, setImgFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  function handleImageSelect(e) {
    if (e?.target?.files && e?.target?.files[0]) {
      const file = e.target.files[0];
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
  }

  async function handleImageUpload() {
    if (!imgFile) {
      console.log("No file selected");
      return;
    }

    try {
      setIsUploading(true);
      const res = await profileImageAPI(imgFile);
      console.log("Upload response:", res);

      if (onImageUpdated) {
        const newImageUrl = res?.data?.photo || res?.photo || imgPreview;
        // Add timestamp to prevent browser caching
        const imageUrlWithCacheBust = newImageUrl.includes("?")
          ? `${newImageUrl}&t=${Date.now()}`
          : `${newImageUrl}?t=${Date.now()}`;

        onImageUpdated(imageUrlWithCacheBust);
      }

      return res;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancel(onClose) {
    onClose();
    setImgPreview(currentImage || null);
    setImgFile(null);
  }

  async function handleSave(onClose) {
    const result = await handleImageUpload();
    if (result) {
      onClose();
      setImgFile(null);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change Profile Image
            </ModalHeader>
            <ModalBody className="flex justify-center items-center">
              <div className="relative">
                <Image
                  alt="User profile image"
                  className="object-cover max-h-96 max-w-xs rounded-lg"
                  src={imgPreview}
                />
                <label
                  htmlFor="inputField"
                  className="absolute right-2 z-20 bottom-2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                  aria-label="Change image"
                >
                  <input
                    id="inputField"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    hidden
                  />
                  <EditIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </label>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="ghost"
                onPress={() => handleCancel(onClose)}
                isDisabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="px-4"
                variant="shadow"
                onPress={() => handleSave(onClose)}
                isDisabled={!imgFile || isUploading}
                isLoading={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
