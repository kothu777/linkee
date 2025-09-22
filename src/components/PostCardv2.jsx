import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "@heroui/react";
import { useTimeAgo } from "../hooks/useTimeAgo";
import Comment from "./Comment";
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

      <div
        className=" cursor-pointer w-fit "
        onClick={() => {
          setIsLiked(!isLiked);
          setIsPinging(true);
          setTimeout(() => setIsPinging(false), 700);
        }}
      >
        <span className="mr-2">
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

      <div className="relative">
        <input
          className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 dark:bg-slate-600 rounded-lg placeholder:text-slate-600 dark:placeholder:text-slate-300 font-medium pr-20"
          type="text"
          placeholder="Write a comment"
        />
        <span className="flex absolute right-3 top-2/4 -mt-3 items-center">
          <svg
            className="mr-2"
            style={{ width: 26, height: 26 }}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z"
            ></path>
          </svg>
          <svg
            className="fill-blue-500 dark:fill-slate-50"
            style={{ width: 24, height: 24 }}
            viewBox="0 0 24 24"
          >
            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </span>
      </div>
      {/* Comments content */}
      {post?.comments && (
        <div className="pt-6">
          {/* Comment row */}
         <Comment comment={post?.comments[0]} />
          {/* End comments row */}

          {/* More comments */}
          <div className="w-full">
            <Link
              to={`/post/${post?.id}`}
              className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75"
            >
              Show more comments
            </Link>
          </div>
          {/* End More comments */}
        </div>
      )}
      {/* End Comments content */}
    </article>
  );
}
