import { Button, Image } from "@heroui/react";
import { useState } from "react";
import { Textarea } from "@heroui/input";
import { addPost } from "../Services/PostsService";
import { toast } from "react-toastify";
import { ImageIcon } from "./icons/ImageIcon";
// import imageImage from "../assets/testImage.jpg";
// *===================================================*
// *============== Create Post Component ==============*
// *===================================================*
  export default function CreatePost({ fetchAllPosts }) {
  const [showForm, setShowForm] = useState(false);
  const [textAreaBody, setTextAreaBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imgPreview, setImgPreview] = useState("");
  const [imgFile, setImgFile] = useState(null);
  
  // !============= Image Upload Handler ==============
  function handleImageUpload(e) {
    if (e.target?.files[0]) {
      setImgPreview(URL.createObjectURL(e.target.files[0]));
      setImgFile(e.target.files[0]);
    }
  }
  // !================= Remove Uploaded Image =================
  function removeUploadedImg() {
    setImgPreview("");
    setImgFile(null);
    document.getElementById("fileInput").value = null;
  }
  //  !================= Create Post Handler =================
  const handleCreatePost = async () => {
    try {
      setIsLoading(true);
      if (textAreaBody.trim().length !== 0 || imgFile) {
        const result = await addPost({ textAreaBody, imgFile });
        if (result.success) {
         fetchAllPosts();
        }
        setTextAreaBody("");
        setShowForm(false);
        toast.success("Post created successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
        });
       fetchAllPosts();
      } else {
        toast.error("Post body cannot be empty");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="py-4 mb-4 mx-auto w-full max-w-xl -mt-5 bg-gray-50 dark:bg-slate-800 shadow-lg rounded-lg px-7 border border-slate-200 dark:border-slate-700">
      {showForm ? (
        <form
          className=" w-full flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreatePost();
          }}
        >
          <Textarea
            autoFocus
            value={textAreaBody}
            onChange={(e) => setTextAreaBody(e.target.value)}
            rows={15}
            maxLength={5000}
            errorMessage="The post body should be less than 5000 characters long."
            classNames={{
              inputWrapper:
                "ring-0 focus:ring-0 focus:outline-none data-[focus=true]:ring-0 data-[focus-visible=true]:ring-0 group-data-[focus=true]:ring-0",
              input: "focus:outline-none focus:ring-0",
            }}
            label="Post Body"
            placeholder="Enter your post body here"
            variant="faded"
            isClearable
            onClear={() => setTextAreaBody("")}
          />
          <small
            className={`${
              textAreaBody.length == 5000
                ? "text-red-500 dark:text-red-400"
                : textAreaBody.length > 4000
                ? "text-yellow-500 dark:text-yellow-400"
                : "text-gray-400 dark:text-slate-500"
            } -mt-2`}
          >
            {textAreaBody.length}/5000
          </small>
          <div className="relative w-fit mx-auto">
            {imgFile && (
              <>
                <Button
                  color="danger"
                  size="sm"
                  radius="full"
                  className="absolute -top-0.5 -right-0.5 z-10"
                  isIconOnly
                  aria-label="Remove Image"
                  rounded
                  onPress={removeUploadedImg}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
                <Image
                  src={imgPreview}
                  alt="Image Preview"
                  className="w-fit mx-auto object-cover z-0"
                ></Image>{" "}
              </>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              {/* Image Upload Button */}
              <label className="cursor-pointer text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200">
                <input
                  // onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  id="fileInput"
                />
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Photo</span>
                </div>
              </label>
            </div>

            <div className="flex items-center w-fit ms-auto gap-4 mt-auto">
              <Button
                variant="ghost"
                color="danger"
                onPress={() => {
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                variant="shadow"
                isLoading={isLoading}
              >
                Post
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Button
          onPress={() => {
            setShowForm(true);
          }}
          className="w-full flex justify-start text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
          variant="bordered"
        >
          {" "}
          What's on your mind?
        </Button>
      )}
    </div>
  );
}
