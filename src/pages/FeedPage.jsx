import React, { useEffect, useState } from "react";
import { getAllPostsAPI } from "../Services/PostsService";
import SpinnerComponent from "../components/Spinner";
import PostCardV2 from "../components/PostCardv2";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility function to format date
  function formatTimeAgo(createdAt) {
    const date = new Date(createdAt);
    const now = Date.now();
    const timeDiff = now - date.getTime();
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor(timeDiff / (1000 * 60));

    if (days > 7) {
      return `${date.toLocaleDateString()}`;
    } else if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `just now`;
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { posts: fetchedPosts } = await getAllPostsAPI();
        
        // Map over the posts array and add uploadedFrom to each post
        const postsWithTimeAgo = fetchedPosts.map(post => ({
          ...post,
          uploadedFrom: formatTimeAgo(post.createdAt)
        }));
        
        setPosts(postsWithTimeAgo);
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
        <div className="flex items-center justify-center">
          <SpinnerComponent label="Loading Posts..." />
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