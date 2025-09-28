import { useState } from "react";
import { useTimeAgo } from "../hooks/useTimeAgo";
import { Image } from "@heroui/react";

export default function SingleComments({ comment }) {
  const [isLikedComment, setIsLikedComment] = useState(false);
  const [isPingingComment, setIsPingingComment] = useState(false);
  const formatTimeAgo = useTimeAgo();
  return (
    <div>
      <div className="flex">
        <Image
          alt="user avatar"
          className="rounded-full"
          src="https://linked-posts.routemisr.com/uploads/default-profile.png"
          height={40}
          width={40}
        />
        <div className="media-body">
          <div>
            <h1 className="inline-block text-base font-bold mr-2">
              {comment?.commentCreator?.name}
            </h1>
            <small className="text-slate-500 text-xs dark:text-slate-300">
              {formatTimeAgo(comment?.createdAt || new Date().toISOString())}
            </small>
          </div>
          <p>{comment?.content}</p>

          <div
            className="cursor-pointer py-3 "
            onClick={(e) => {
              e.preventDefault();
              setIsLikedComment((prev) => !prev);
              setIsPingingComment(true);
              setTimeout(() => setIsPingingComment(false), 700);
            }}
          >
            <span>
              <svg
                className={`${
                  isLikedComment
                    ? "fill-rose-600 dark:fill-rose-400 transition-all duration-300"
                    : "fill-slate-500 dark:fill-slate-300"
                } ${isPingingComment ? "animate-ping" : ""}`}
                style={{ width: 22, height: 22 }}
                viewBox="0 0 24 24"
              >
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
