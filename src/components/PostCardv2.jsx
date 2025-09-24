import { useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "@heroui/react";
import { useTimeAgo } from "../hooks/useTimeAgo";
import Comment from "./Comments";
import AddCommentField from "./AddCommentField";

export default function PostCardV2({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const formatTimeAgo = useTimeAgo();
  return (
    <article className="mb-4 break-inside p-6 max-w-xl shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col bg-clip-border">
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
      </div>
      <p className="dark:text-slate-200">{post?.body}</p>
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
        <AddCommentField postId={post?._id}/>
        {/* Comments section */}
        {post.comments.length > 0 && (
          <div className="pt-6 flex flex-col">
            {/* Comment row */}
            <div className="flex flex-col gap-4 mb-4 ">
              <Comment comments={post?.comments} postId={post?._id} />
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
  );
}
