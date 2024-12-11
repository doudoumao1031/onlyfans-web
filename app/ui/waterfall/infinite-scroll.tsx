"use client";

import React, { useEffect, useState } from "react";
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

    const { data, isValidating } = useSWR<{ items: number[]; hasMore: boolean }>(
        hasMore ? `/api/seeds?page=${page}` : null,
        fetcher,
        { revalidateOnFocus: false, keepPreviousData: true }
    );

    useEffect(() => {
        if (data && page > 1) {
            setItems((prev) => [...prev, ...data.items]);
            setHasMore(data.hasMore);
        }
    }, [data]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 10
        ) {
            if (hasMore && !isValidating) {
                setPage((prev) => prev + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, isValidating]);

    return (
      <>
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
      </>
    );
};

