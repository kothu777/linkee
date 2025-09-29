import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonGroup, Image, useDisclosure } from "@heroui/react";
import { useTimeAgo } from "../hooks/useTimeAgo";
import Comment from "./Comments";
import AddCommentField from "./AddCommentField";


import { useContext } from "react";
import { UserDataContext } from "../contexts/userDataContext.jsx";
import { deletePostsAPI } from "@/Services/PostsService";
import { toast } from "react-toastify";
import DropDownComponent from "./DropDownComponent";
import DeleteModalComponent from "./DeleteModalComponent";
// *=====================================================================*
// *======================== Post Card Component ========================*
// *=====================================================================*
export default function PostCardV2({ post, fetchAllPosts }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isPostDeleting, setIsPostDeleting] = useState(false);
  const textRef = useRef(null);
  const formatTimeAgo = useTimeAgo();
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const isPostByLoggedUser = userData?._id === post?.user?._id;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // !================ Check if text is actually clamped by comparing scrollHeight with clientHeight ================!
  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      const isTextClamped = element.scrollHeight > element.clientHeight;
      setShowReadMore(isTextClamped);
    }
  }, [post?.body]);
  // !============= Handle delete post function =============
  const handleDeletePost = async (postId, onClose) => {
    try {
      setIsPostDeleting(true);
      const res = await deletePostsAPI(postId);
      if (res?.message === "success") {
        await fetchAllPosts();
        toast.success("Post deleted successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
        });
        onClose();
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
  const handleUpdatePost = (postId) => {
    console.log(`Update post with ID: ${postId}`);
  };
  // ?===================================================!
  // ?================ Post Card JSX ====================!
  // ?===================================================!
  return (
    <>
      <article className="mb-4 break-inside w-full mx-auto p-5 max-w-xl shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col bg-clip-border">
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
           <DropDownComponent handleUpdatePost={handleUpdatePost} onOpen={onOpen} deletedComponent={post} type={"post"}/>
          )}
        </div>
        <div>
          <p
            ref={textRef}
            className="dark:text-slate-200 break-words text-wrap line-clamp-3"
          >
            {post?.body}
          </p>
          {showReadMore && (
            <button
              onClick={() =>
                navigate(`/post-details/${post?.id}`, { replace: true })
              }
              className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200 flex items-center gap-1"
            >
              Read more <i className="fa-solid fa-arrow-right mt-0.5"></i>
            </button>
          )}
        </div>
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
        <section className="flex items-center justify-between">
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
                } ${isPinging ? "animate-ping" : ""} block`}
                style={{ width: 30, height: 30 }}
                viewBox="0 0 24 24"
              >
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
              </svg>
            </span>
          </div>
          <Link
            to={`/post-details/${post?.id}`}
            replace
            className="cursor-pointer"
          >
            <i className="fa-regular fa-comment"></i>
            {`${post?.comments?.length || 0} Comment${
              post?.comments?.length > 1 ? "s" : ""
            }`}
          </Link>
        </section>

        {/* Comments content */}
        <div className="pt-4 flex flex-col gap-4">
          <AddCommentField postId={post?._id} />
          {/* Comments section */}
          {post.comments.length > 0 && (
            <div className="pt-6 flex flex-col ">
              {/* Comment row */}
              <div className="flex flex-col gap-4 mb-4 ">
                <Comment comments={post?.comments} postId={post?._id} postOwnerId={post?.user?._id} onCommentDeleted={fetchAllPosts} />
              </div>

              {/* End comments row */}

              {/* More comments */}
              <div className="w-full">
                <Link
                  to={`/post-details/${post?.id}`}
                  replace
                  className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75"
                >
                  Show more comments
                </Link>
              </div>
              {/* End More comments */}
            </div>
          )}
        </div>
        {/* End Comments content */}
      </article>
      {/* Delete Confirmation Modal */}
      <DeleteModalComponent isOpen={isOpen} onOpenChange={onOpenChange} isDeleting={isPostDeleting} handleDelete={handleDeletePost} deletedComponent={post} type={"post"}/>
    </>
  );
}
