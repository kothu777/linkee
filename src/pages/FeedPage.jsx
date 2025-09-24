import { useEffect, useRef, useState, useCallback } from "react";
import { getAllPostsAPI } from "../Services/PostsService";
import PostCardV2 from "../components/PostCardv2";
import SkeletonCard from "../components/SkeletonCard";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const loadMoreRef = useRef(null);
  const POSTS_PER_PAGE = 10;

  // Initial posts fetch
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllPostsAPI(1, POSTS_PER_PAGE);
        // Handle different response structures
        const postsData = response?.posts;
        const totalPosts = response?.paginationInfo?.total;

        setPosts(postsData);
        setCurrentPage(1);

        // Check if there are more posts to load
        if (totalPosts) {
          setHasNextPage(postsData.length < totalPosts);
        } else {
          // If no total count, assume there might be more if we got a full page
          setHasNextPage(postsData.length === POSTS_PER_PAGE);
        }
      } catch (err) {
        console.error("Error fetching initial posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, []);

  // Load more posts function
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasNextPage) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      const response = await getAllPostsAPI(nextPage, POSTS_PER_PAGE);
      const newPosts = response?.posts;
      const totalPosts = response?.paginationInfo?.total;

      if (newPosts && newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setCurrentPage(nextPage);

        // Update hasNextPage based on response
        if (totalPosts) {
          const totalLoadedPosts = posts.length + newPosts.length;
          setHasNextPage(totalLoadedPosts < totalPosts);
        } else {
          // If no total count, check if we got a full page
          setHasNextPage(newPosts.length === POSTS_PER_PAGE);
        }
      } else {
        // No more posts available
        setHasNextPage(false);
      }
    } catch (err) {
      console.error("Error loading more posts:", err);
      // Don't show error for load more, just log it
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, loadingMore, hasNextPage, posts.length]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || loading || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadingMore && hasNextPage) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loadMorePosts, loading, loadingMore, hasNextPage]);

  // Retry function for errors
  const handleRetry = () => {
    window.location.reload();
  };

  // Initial loading state
  if (loading) {
    return (
      <div className="grid gap-3 mx-auto min-h-screen items-start justify-center p-3 pt-8">
        <div className="flex items-center flex-col justify-center gap-3">
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid gap-3 mx-auto min-h-screen items-center justify-center p-3">
        <div className="text-center text-red-500">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
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
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No posts yet</h3>
          <p>Be the first to share something!</p>
        </div>
      </div>
    );
  }

  // Posts display
  return (
    <div className="grid gap-3 mx-auto min-h-screen items-start justify-center p-3 pt-8">
      {/* Posts list */}
      {posts.map((post, index) => (
        <div key={`${post?.id}-${index}`}>
          <PostCardV2 post={post} />
        </div>
      ))}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="py-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-slate-500 dark:text-slate-400">
              Loading more posts...
            </span>
          </div>
        </div>
      )}

      {/* Load more sentinel */}
      {hasNextPage && !loadingMore && (
        <div
          ref={loadMoreRef}
          className="py-6 text-center text-slate-500 dark:text-slate-400"
          style={{ minHeight: "50px" }}
        >
          <div className="flex items-center justify-center">
            <span>Scroll for more posts...</span>
          </div>
        </div>
      )}

      {/* End of posts indicator */}
      {!hasNextPage && posts.length > 0 && (
        <div className="py-8 text-center text-slate-400 dark:text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-px bg-slate-300 dark:bg-slate-600"></div>
            <span className="text-sm font-medium">You've seen it all!</span>
            <div className="w-16 h-px bg-slate-300 dark:bg-slate-600"></div>
          </div>
        </div>
      )}
    </div>
  );
}
