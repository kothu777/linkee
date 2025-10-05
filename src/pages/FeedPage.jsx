import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { getAllPostsAPI } from "../Services/PostsService";
import PostCardV2 from "../components/PostCardv2";
import SkeletonCard from "../components/SkeletonCard";
import CreatePost from "../components/CreatePost";
import { useQuery } from "@tanstack/react-query";

export default function FeedPage() {
  const [allPosts, setAllPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);
  
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const POSTS_PER_PAGE = 20;

  // Initial posts fetch with useQuery
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts", 1, POSTS_PER_PAGE],
    queryFn: () => getAllPostsAPI(1, POSTS_PER_PAGE),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update state when initial data is fetched
  useEffect(() => {
    if (data) {
      setAllPosts(data.posts || []);
      const paginationInfo = data.paginationInfo;
      const hasNext = paginationInfo?.currentPage < paginationInfo?.numberOfPages;
      setHasNextPage(hasNext);
      setCurrentPage(paginationInfo?.currentPage || 1);
      setLoadMoreError(null);
    }
  }, [data]);

  // Memoize skeleton cards to prevent unnecessary re-renders
  const skeletonCards = useMemo(
    () =>
      [...Array(5)].map((_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      )),
    []
  );

  // Fetch all posts function for refresh
  const fetchAllPosts = useCallback(async () => {
    try {
      setLoadMoreError(null);
      const response = await getAllPostsAPI(1, POSTS_PER_PAGE);
      const postsData = response?.posts;
      const paginationInfo = response?.paginationInfo;

      if (postsData) {
        setAllPosts(postsData);
        const hasNext = paginationInfo?.currentPage < paginationInfo?.numberOfPages;
        setHasNextPage(hasNext);
        setCurrentPage(paginationInfo?.currentPage || 1);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoadMoreError(err.message || "Failed to refresh posts");
    }
  }, [POSTS_PER_PAGE]);

  // Load more posts function
  const loadMorePosts = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingMore || !hasNextPage) return;

    try {
      setLoadingMore(true);
      setLoadMoreError(null);
      
      const nextPage = currentPage + 1;
      const response = await getAllPostsAPI(nextPage, POSTS_PER_PAGE);
      const newPosts = response?.posts;
      const paginationInfo = response?.paginationInfo;

      if (newPosts && newPosts.length > 0) {
        setAllPosts((prevPosts) => {
          // Prevent duplicate posts
          const existingIds = new Set(prevPosts.map(post => post.id));
          const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
          return [...prevPosts, ...uniqueNewPosts];
        });
        
        const hasNext = paginationInfo?.currentPage < paginationInfo?.numberOfPages;
        setHasNextPage(hasNext);
        setCurrentPage(paginationInfo?.currentPage || nextPage);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      console.error("Error loading more posts:", err);
      setLoadMoreError(err.message || "Failed to load more posts");
      // Don't update hasNextPage on error, allow retry
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasNextPage, loadingMore, POSTS_PER_PAGE]);

  // Setup IntersectionObserver for infinite scroll
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Don't set up observer if we're in initial loading, there's no more pages, or already loading more
    if (isLoading || !hasNextPage || loadingMore) return;

    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    // Create new observer
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observerRef.current = observer;
    observer.observe(currentRef);

    // Cleanup function
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isLoading, hasNextPage, loadingMore, loadMorePosts]);

  // Retry function for errors
  const handleRetry = () => {
    setLoadMoreError(null);
    refetch();
  };

  // Retry loading more
  const handleRetryLoadMore = () => {
    setLoadMoreError(null);
    loadMorePosts();
  };

  // Initial loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 mx-auto min-h-screen items-center p-3 pt-8 w-full max-w-2xl">
        <div className="flex items-center flex-col justify-center gap-3">
          {skeletonCards}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col gap-3 mx-auto min-h-screen items-center justify-center p-3 w-full max-w-2xl">
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
          <p className="mb-4" role="alert">
            {error?.message || "Failed to load posts. Please try again."}
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Retry loading posts"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (allPosts.length === 0 && !loadingMore) {
    return (
      <div className="flex flex-col gap-3 mx-auto min-h-screen items-center justify-center p-3 w-full max-w-2xl">
        <CreatePost fetchAllPosts={fetchAllPosts} />
        <div className="text-center text-gray-500 mt-8">
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
    <div className="flex flex-col gap-3 mx-auto min-h-screen items-center p-3 pt-8 w-full max-w-2xl">
      {/* Create Post */}
      <CreatePost fetchAllPosts={fetchAllPosts} />

      {/* Posts list */}
      <main role="main" aria-label="Posts feed" className="w-full">
        {allPosts.map((post) => (
          <article key={post?.id || `post-${Math.random()}`} className="w-full">
            <PostCardV2 post={post} fetchAllPosts={fetchAllPosts} />
          </article>
        ))}
      </main>

      {/* Load more error */}
      {loadMoreError && (
        <div className="py-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 mb-2">{loadMoreError}</p>
            <button
              onClick={handleRetryLoadMore}
              className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry Loading More
            </button>
          </div>
        </div>
      )}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="py-6 text-center">
          <div
            className="flex items-center justify-center gap-3"
            role="status"
            aria-live="polite"
          >
            <div
              className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
              aria-hidden="true"
            ></div>
            <span className="text-slate-500 dark:text-slate-400">
              Loading more posts...
            </span>
          </div>
        </div>
      )}

      {/* Load more sentinel */}
      {hasNextPage && !loadingMore && !loadMoreError && (
        <div
          ref={loadMoreRef}
          className="h-10 w-full"
          aria-hidden="true"
        />
      )}

      {/* End of posts indicator */}
      {!hasNextPage && allPosts.length > 0 && (
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