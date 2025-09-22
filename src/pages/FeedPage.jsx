import React, { useEffect, useState } from "react";
import { getAllPostsAPI } from "../Services/PostsService";
// import SpinnerComponent from "../components/Spinner";
import PostCardV2 from "../components/PostCardv2";
import SkeletonCard from "../components/SkeletonCard";
export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { posts } = await getAllPostsAPI();
        setPosts(posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="grid gap-3 mx-auto min-h-screen items-center justify-center p-3">
        <div className="flex items-center flex-col justify-center">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid gap-3 mx-auto min-h-screen items-center justify-center p-3">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 font-bold bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="grid gap-3 mx-auto min-h-screen items-center justify-center p-3">
        <div className="text-center text-gray-500">
          <p>No posts available</p>
        </div>
      </div>
    );
  }

  // Posts display
  return (
    <div className="grid gap-3 mx-auto min-h-screen items-center justify-center p-3">
      {posts.map((post) => (
        <div key={post?.id}>
          <PostCardV2 post={post} />
        </div>
      ))}
    </div>
  );
}
