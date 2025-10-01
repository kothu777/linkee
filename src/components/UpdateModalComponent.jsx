import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
  } from "@heroui/react";
  import { Textarea } from "@heroui/input";
import { Image } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

export default function UpdateModalComponent({
  isOpen,
  onOpenChange,
  handleUpdate,
  updatedComponent,
  isUpdating,
}) {
  const [updatedContent, setUpdatedContent] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [removeOriginalImage, setRemoveOriginalImage] = useState(false);
  const fileInputRef = useRef(null);

  // Update form state when updatedComponent changes
  useEffect(() => {
    if (updatedComponent) {
      setUpdatedContent(updatedComponent.body || "");
      setImgPreview(updatedComponent.image || null);
      setImgFile(null); // Reset file input when component changes
      setRemoveOriginalImage(false); // Reset remove flag
    }
  }, [updatedComponent]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setRemoveOriginalImage(false); // Reset remove flag when new image is selected
      const reader = new FileReader();
      reader.onload = (e) => setImgPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const removeUploadedImg = () => {
    if (imgFile) {
      // User uploaded a new image, remove it and show original
      setImgFile(null);
      setImgPreview(updatedComponent?.image || null);
      setRemoveOriginalImage(false);
    } else if (updatedComponent?.image) {
      // User wants to remove the original image completely
      setRemoveOriginalImage(true);
      setImgPreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = (e, onClose) => {
    e.preventDefault();
    
    if (!updatedContent.trim()) {
      toast.error("Post content cannot be empty", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
      });
      return;
    }

    // Check if user is trying to remove image (backend limitation)
    if (removeOriginalImage && !imgFile) {
      toast.warning("Image removal is not supported by the API. Only text content will be updated.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      
      // Proceed with just text update, keep existing image
      const updatedData = {
        textAreaBody: updatedContent.trim(),
        imgFile: null,
        removeImage: false, // Don't attempt image removal
      };
      
      handleUpdate(updatedData, onClose);
      return;
    }

    const updatedData = {
      textAreaBody: updatedContent.trim(),
      imgFile: imgFile,
      removeImage: removeOriginalImage && !imgFile, // Remove original image if no new image
    };

    // Debug log (can be removed in production)
    // console.log("UpdateModalComponent - Data being sent:", updatedData);

    handleUpdate(updatedData, onClose);
  };

  // Reset form when modal opens
  const handleModalOpenChange = (open) => {
    if (open && updatedComponent) {
      // Ensure we have the latest data when modal opens
      setUpdatedContent(updatedComponent.body || "");
      setImgFile(null);
      setImgPreview(updatedComponent.image || null);
      setRemoveOriginalImage(false); // Reset remove flag
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (open && !updatedComponent) {
      console.warn("Modal opened but updatedComponent is not available");
    }
    onOpenChange(open);
  };

  // Don't render modal if no data is available
  if (!updatedComponent) {
    return null;
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={handleModalOpenChange} 
      size="2xl" 
      className="mt-16"
      scrollBehavior="inside"
    >
      <ModalContent className="max-h-[90vh]">
          {(onClose) => (
            <>
            <ModalHeader className="flex flex-col gap-1">
              Update Post
            </ModalHeader>
            <ModalBody className="overflow-y-auto">
              <form
                className="w-full flex flex-col gap-4"
                onSubmit={(e) => handleSubmit(e, onClose)}
              >
                <Textarea
                  autoFocus
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                  rows={8}
                  maxLength={5000}
                  classNames={{
                    inputWrapper:
                      "ring-0 focus:ring-0 focus:outline-none data-[focus=true]:ring-0 data-[focus-visible=true]:ring-0 group-data-[focus=true]:ring-0",
                    input: "focus:outline-none focus:ring-0",
                  }}
                  label="Post Content"
                  placeholder="Enter your post content here"
                  variant="faded"
                  isClearable
                  onClear={() => setUpdatedContent("")}
                  isDisabled={isUpdating}
                />
                <small
                  className={`${
                    updatedContent.length === 5000
                      ? "text-red-500"
                      : updatedContent.length > 4000
                      ? "text-yellow-500"
                      : "text-gray-400"
                  } -mt-2`}
                >
                  {updatedContent.length}/5000
                </small>

                {/* Image Preview */}
                <div className="relative w-fit mx-auto">
                  {imgPreview && (
                    <>
                      <Button
                        color="danger"
                        size="sm"
                        radius="full"
                        className="absolute -top-0.5 -right-0.5 z-10"
                        isIconOnly
                        aria-label="Remove Image"
                        onPress={removeUploadedImg}
                        isDisabled={isUpdating}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </Button>
                      <Image
                        src={imgPreview}
                        alt="Image Preview"
                        className="w-full max-w-md max-h-80 mx-auto object-cover z-0 rounded-lg"
                      />
                    </>
                  )}
                  {/* Show message when original image is removed */}
                  {removeOriginalImage && !imgPreview && updatedComponent?.image && (
                    <div className="w-full max-w-md mx-auto p-6 border-2 border-dashed border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                      <i className="fa-solid fa-exclamation-triangle text-3xl text-yellow-500 mb-2"></i>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-2">
                        Image Removal Not Supported
                      </p>
                      <p className="text-yellow-600 dark:text-yellow-400 text-xs mb-3">
                        The backend API doesn't support image removal. Only text content will be updated.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          color="warning"
                          variant="light"
                          size="sm"
                          onPress={() => {
                            setRemoveOriginalImage(false);
                            setImgPreview(updatedComponent.image);
                          }}
                          isDisabled={isUpdating}
                        >
                          Keep Image
                        </Button>
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          onPress={() => {
                            // Allow them to upload a replacement image instead
                            if (fileInputRef.current) {
                              fileInputRef.current.click();
                            }
                          }}
                          isDisabled={isUpdating}
                        >
                          Replace Instead
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="flex items-center">
                  <label className="cursor-pointer text-gray-600 hover:text-blue-600 transition duration-200">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUpdating}
                    />
                    <div className="flex items-center gap-2">
                      <i className="fa-regular fa-image fa-lg"></i>
                      <span className="text-sm font-medium">
                        {imgFile ? "Change Photo" : "Add Photo"}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    color="default"
                    onPress={onClose}
                    isDisabled={isUpdating}
                  >
                  Cancel
                </Button>
                  <Button
                    color="primary"
                    type="submit"
                    variant="shadow"
                    isLoading={isUpdating}
                    loadingText="Updating..."
                    isDisabled={isUpdating}
                  >
                    Update Post
                </Button>
                </div>
              </form>
            </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}
