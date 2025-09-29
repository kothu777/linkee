import { useNavigate, useParams } from "react-router-dom";
import { getSinglePostsAPI, deletePostsAPI, updatePost } from "../Services/PostsService";
import { useCallback, useEffect, useState, useContext } from "react";
import SpinnerComponent from "../components/SpinnerComponent";
import ErrorPage from "./ErrorPage";
import { Button, Image, useDisclosure } from "@heroui/react";
import { useTimeAgo } from "../hooks/useTimeAgo";
import Comment from "../components/Comments";
import AddCommentField from "../components/AddCommentField";
import { UserDataContext } from "../contexts/userDataContext.jsx";
import { toast } from "react-toastify";
import DropDownComponent from "../components/DropDownComponent";
import DeleteModalComponent from "../components/DeleteModalComponent";
import UpdateModalComponent from "../components/UpdateModalComponent";

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsLimit, setCommentsLimit] = useState(2);
  const [isPinging, setIsPinging] = useState(false);
  const [isPostDeleting, setIsPostDeleting] = useState(false);
  const [isPostUpdating, setIsPostUpdating] = useState(false);
  const formatTimeAgo = useTimeAgo();
  const { userData } = useContext(UserDataContext);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onOpenChange: onUpdateOpenChange } = useDisclosure();
  const isPostByLoggedUser = userData?._id === post?.user?._id;

  // !============= Handle delete post function =============
  const handleDeletePost = async (postId, onClose) => {
    try {
      setIsPostDeleting(true);
      const res = await deletePostsAPI(postId);
      if (res?.message === "success") {
        toast.success("Post deleted successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
        });
        onClose();
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post. Please try again.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
      });
    } finally {
      setIsPostDeleting(false);
    }
  };
  // !============= Handle Update post function =============
  const handleUpdatePost = () => {
    // Open the update modal when edit is clicked
    onUpdateOpen();
  };

  // !============= Handle Save Updated Post =============
  const handleSaveUpdatedPost = async (updatedData, onClose) => {
    try {
      setIsPostUpdating(true);
      const res = await updatePost(post._id, updatedData);
      if (res?.data?.message === "success") {
        await fetchPost(); // Refresh post data
        toast.success("Post updated successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
        });
        onClose();
      }
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Failed to update post. Please try again.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
      });
    } finally {
      setIsPostUpdating(false);
    }
  };
  // !============= Handle fetch post details function =============
  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const { post } = await getSinglePostsAPI(id);
      setPost(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      setErrorMessage(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, fetchPost]);

  const handleShowMoreComments = () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setCommentsLimit((prev) => prev * 2);
    } catch (error) {
      console.error("Error showing more comments:", error);
      setErrorMessage(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <SpinnerComponent label="Loading post..." />
      ) : errorMessage ? (
        <ErrorPage error={errorMessage} />
      ) : !post ? (
        setErrorMessage("Post not found")
      ) : (
        <article className="my-4 mx-auto break-inside p-6 max-w-xl shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col bg-clip-border">
          <div className="flex pb-6 items-center justify-between">
            <div className="flex gap-2">
              <Image
                alt="user avatar"
                className="rounded-full"
                src={post?.user?.photo}
                height={46}
                width={46}
              />

              <div className="flex flex-col">
                <div className="text-lg font-bold dark:text-white">
                  {post?.user?.name}
                </div>
                <div className="text-slate-500 dark:text-slate-300">
                  {formatTimeAgo(post?.createdAt)}
                </div>
              </div>
            </div>
            {isPostByLoggedUser && (
              <DropDownComponent 
                handleUpdatePost={handleUpdatePost} 
                onOpen={onDeleteOpen} 
                deletedComponent={post} 
                type={"post"}
              />
            )}
          </div>
          <p className="dark:text-slate-200 break-words">{post?.body}</p>
          <div className="py-4">
            {post?.image && (
              <div className=" flex justify-center mb-1 w-full">
                <Image
                  alt="post image"
                  className="max-w-full rounded-tl-lg object-cover"
                  src={post?.image}
                />
              </div>
            )}
          </div>
          <section className="flex items-center justify-between ">
            {/* Love icon */}
            <div
              className=" cursor-pointer w-fit "
              onClick={() => {
                setIsLiked(!isLiked);
                setIsPinging(true);
                setTimeout(() => setIsPinging(false), 700);
              }}
            >
              <span className="mr-2 flex items-center">
                <svg
                  className={`${
                    isLiked
                      ? "fill-rose-600 dark:fill-rose-400 transition-all duration-300"
                      : "fill-slate-500 dark:fill-slate-300"
                  } ${isPinging ? "animate-ping" : ""}`}
                  style={{ width: 30, height: 30 }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
                </svg>
              </span>
            </div>
            {/* Number of comments */}
            <div className="cursor-pointer">
              <i className="fa-regular fa-comment"></i>
              {`${post?.comments?.length || 0} Comment${
                post?.comments?.length > 1 ? "s" : ""
              }`}
            </div>
          </section>
          {/* ================= Comment section  =================*/}
          <div className="pt-4 flex flex-col gap-4">
            <AddCommentField postId={post?._id} onCommentAdded={fetchPost} />
            {/* Comments content */}
            {post.comments.length > 0 ? (
              <div className="pt-4 flex flex-col gap-4">
                {/* Comment row */}
                <Comment
                  comments={post?.comments}
                  commentsLimit={commentsLimit}
                  postOwnerId={post?.user?._id}
                  onCommentDeleted={fetchPost}
                />
                {/* End comments row */}
                {post.comments.length > commentsLimit && (
                  <div className="flex justify-center">
                    <Button
                      onPress={() => {
                        handleShowMoreComments();
                      }}
                    >
                      Show More Comments
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              // !=========== No comments yet ===========
              <div className="pt-6">
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    No comments yet
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Be the first to share your thoughts on this post!
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* End Comments content */}
        </article>
      )}
      <UpdateModalComponent
        isOpen={isUpdateOpen}
        onOpenChange={onUpdateOpenChange}
        handleUpdate={handleSaveUpdatedPost}
        updatedComponent={post}
        isUpdating={isPostUpdating}
      />
      <DeleteModalComponent
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        isDeleting={isPostDeleting}
        handleDelete={handleDeletePost}
        deletedComponent={post}
        type={"post"}
      />
    </>
  );
}
