import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { getAllPostsAPI } from "../Services/PostsService";
import PostCardV2 from "../components/PostCardv2";
import SkeletonCard from "../components/SkeletonCard";
import CreatePost from "../components/CreatePost";
import { useQuery } from "@tanstack/react-query";

export default function FeedPage() {
  const [allPosts, setAllPosts] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const loadMoreRef = useRef(null);
  const POSTS_PER_PAGE = 40;

  // Refs to hold the latest state values to avoid stale closures in callbacks
  const loadingMoreRef = useRef(false);
  const hasNextPageRef = useRef(true);
  const currentPageRef = useRef(1);

  // Initial posts fetch with useQuery
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts", 1, POSTS_PER_PAGE],
    queryFn: () => getAllPostsAPI(1, POSTS_PER_PAGE),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update state when initial data is fetched
  useEffect(() => {
    if (data) {
      setAllPosts(data.posts || []);
      const paginationInfo = data.paginationInfo;
      const hasNext = paginationInfo?.currentPage < paginationInfo?.numberOfPages;
      setHasNextPage(hasNext);

      // Sync refs with initial state
      currentPageRef.current = paginationInfo?.currentPage || 1;
      hasNextPageRef.current = hasNext;
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
      const response = await getAllPostsAPI(1, POSTS_PER_PAGE);
      const postsData = response?.posts;
      const paginationInfo = response?.paginationInfo;

      if (postsData) {
        setAllPosts(postsData);
        const hasNext = paginationInfo?.currentPage < paginationInfo?.numberOfPages;
        setHasNextPage(hasNext);

        // Sync refs on refresh
        currentPageRef.current = paginationInfo?.currentPage || 1;
        hasNextPageRef.current = hasNext;
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }, [POSTS_PER_PAGE]); // Dependency array is now stable

  // Load more posts function
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMorePosts = useCallback(async () => {
    // Use refs to check current values, preventing stale closures
    if (loadingMoreRef.current || !hasNextPageRef.current) return;

    try {
      loadingMoreRef.current = true; // Set ref immediately
      setLoadingMore(true);

      const nextPage = currentPageRef.current + 1;

      const response = await getAllPostsAPI(nextPage, POSTS_PER_PAGE);
      const newPosts = response?.posts;
      const paginationInfo = response?.paginationInfo;

      if (newPosts && newPosts.length > 0) {
        setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
        const hasNext = paginationInfo?.currentPage < paginationInfo?.numberOfPages;
        setHasNextPage(hasNext);

        // Sync refs with new state
        currentPageRef.current = paginationInfo?.currentPage || nextPage;
        hasNextPageRef.current = hasNext;
      } else {
        setHasNextPage(false);
        hasNextPageRef.current = false;
      }
    } catch (err) {
      console.error("Error loading more posts:", err);
    } finally {
      loadingMoreRef.current = false; // Set ref immediately
      setLoadingMore(false);
    }
  }, [POSTS_PER_PAGE]); // Dependency array is now stable

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        if (entry.isIntersecting && !loadingMoreRef.current && hasNextPageRef.current) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "200px", // Start loading 200px before the element is visible
        threshold: 0.1,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, loadMorePosts]);

  // Retry function for errors
  const handleRetry = () => {
    refetch();
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
  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col gap-3 mx-auto min-h-screen items-center justify-center p-3 w-full max-w-2xl">
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
    <div className="flex flex-col gap-3 mx-auto min-h-screen items-center p-3 pt-8 w-full max-w-2xl">
      {/* Create Post */}
      <CreatePost fetchAllPosts={fetchAllPosts} />

      {/* Posts list */}
      <main role="main" aria-label="Posts feed" className="w-full">
        {allPosts.map((post, index) => (
          <article key={`${post?.id}-${index}`} className="w-full">
            <PostCardV2 post={post} fetchAllPosts={fetchAllPosts} />
          </article>
        ))}
      </main>

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
      {hasNextPage && !loadingMore && (
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
