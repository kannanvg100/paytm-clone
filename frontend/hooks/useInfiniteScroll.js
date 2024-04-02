'use client'
import { useRef, useCallback } from 'react';

const useInfiniteScroll = (setPage, loading, hasMore) => {
    const observer = useRef();

    const loaderRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((page) => page + 1)
                }
            });
            if (node) observer.current.observe(node);
        },
        [setPage, loading, hasMore]
    );
    return loaderRef;
};

export default useInfiniteScroll;
