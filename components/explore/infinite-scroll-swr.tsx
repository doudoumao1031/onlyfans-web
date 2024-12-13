"use client";

import React, { useEffect, useState, useRef } from "react";
import { debounce } from "lodash";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface InfiniteScrollProps {
    initialItems: number[];
    initialHasMore: boolean;
}

export default function InfiniteScroll({ initialItems, initialHasMore }: InfiniteScrollProps){
 
    const [items, setItems] = useState<number[]>(initialItems);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const isFetchingRef = useRef(false);
    const containerRef = useRef<HTMLDivElement | null>(null); // Ref for the scrollable container

    const { data, isValidating, error } = useSWR<{ items: number[]; hasMore: boolean }>(
        hasMore ? `/api/feeds?page=${page}` : null,
        fetcher,
        { revalidateOnFocus: false, keepPreviousData: true }
    );

    // Preload the next page
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: nextPageData } = useSWR<{ items: number[]; hasMore: boolean }>(
        hasMore ? `/api/feeds?page=${page + 1}` : null,
        fetcher,
        { revalidateOnFocus: false, keepPreviousData: true }
    );

    // If multiple scroll events fire close together, 
    // there might be race conditions that could lead to overlapping. 
    // Guards against overlapping fetches with a useRef
    useEffect(() => {
        if (data && page > 1 && !isFetchingRef.current) {
            isFetchingRef.current = true;
            setItems((prev) => [...prev, ...data.items]);
            setHasMore(data.hasMore);
            isFetchingRef.current = false;
        }
    }, [data]);

    // const handleScroll = debounce(() => {
    //     if (
    //         window.innerHeight + document.documentElement.scrollTop >=
    //         document.documentElement.offsetHeight - 10
    //     ) {
    //         if (hasMore && !isValidating) {
    //             setPage((prev) => prev + 1);
    //         }
    //     }
    // }, 200);

    const handleScroll = debounce(() => {
        const container = containerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                if (hasMore && !isValidating) {
                    setPage((prev) => prev + 1);
                }
            }
        }
    }, 200);

    // useEffect(() => {
    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, [hasMore, isValidating]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [hasMore, isValidating]);

    if (error) {
        return <div className="text-center mt-4 text-red-500">Failed to load data. Please try again.</div>;
    }

    return (
        <div
            ref={containerRef}
            className="h-full w-full overflow-scroll"
        >
            <div className="max-w-lg mx-auto grid grid-cols-1 gap-4">
                {items.map((item, index) => (
                    <div key={index} className="card shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title">Item {item}</h2>
                            <p>This is a description of item {item}.</p>
                        </div>
                    </div>
                ))}
            </div>
            {isValidating && (
                <div className="text-center mt-4">
                    <button className="btn btn-primary loading">Loading...</button>
                </div>
            )}
            {!hasMore && (
                <div className="text-center mt-4">
                    <p className="text-gray-500">You have reached the end.</p>
                </div>
            )}
        </div>
    );
};

