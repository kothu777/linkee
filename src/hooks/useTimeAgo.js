// hooks/useTimeAgo.js
import { useCallback } from 'react';

export const useTimeAgo = () => {
  const formatTimeAgo = useCallback((createdAt) => {
    if (!createdAt) return '';
    
    const date = new Date(createdAt);
    const now = Date.now();
    const timeDiff = now - date.getTime();
    
    // Handle invalid dates
    if (isNaN(timeDiff) || timeDiff < 0) return 'Invalid date';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor(timeDiff / (1000 * 60));

    if (days > 7) {
      return date.toLocaleDateString();
    } else if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `just now`;
    }
  }, []);

  return formatTimeAgo;
};