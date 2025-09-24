import { Button } from "@heroui/react";
import { useState } from "react";
import { Textarea } from "@heroui/input";
import { addPost } from "../Services/PostsService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function CreatePost() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [textAreaBody, setTextAreaBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleCreatePost = async () => {
    setIsLoading(true);
    const res = await addPost(textAreaBody);
    console.log(res);
    setTextAreaBody("");
    setShowForm(false);
    setIsLoading(false);
    toast.success("Post created successfully");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };
  return (
    <div className="py-4 mb-4  -mt-5 bg-gray-50 shadow-lg rounded-lg px-7">
      {showForm ? (
        <form  className=" w-full flex flex-col gap-2"
        onSubmit={(e)=>{e.preventDefault(); handleCreatePost()}}>
          
            <Textarea
              radius="lg"
              value={textAreaBody}
              onChange={(e) => setTextAreaBody(e.target.value)}
              rows={15}
              maxLength={5000}
              errorMessage="The post body should be less than 5000 characters long."
              label="Post Body"
              placeholder="Enter your post body here"
              variant="bordered"
              
            />
            <small className={`${
            textAreaBody.length == 5000 ? "text-red-500" : 
            textAreaBody.length > 4000 ? "text-yellow-500" : 
            "text-gray-400"
          } -mt-2`}>{textAreaBody.length}/5000</small>
          
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
          <Button color="primary" type="submit" variant="shadow" isLoading={isLoading}>
          Post
        </Button>
          </div>
        </form>
      ) : (
        <Button
          onPress={() => {
            setShowForm(true);
          }}
          className="w-full flex justify-start"
          variant="bordered"
        >
          {" "}
          What's on your mind, Abdelfattah?
        </Button>
      )}
    </div>
  );
}
