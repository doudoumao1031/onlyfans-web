"use client"

import React, { useState, useEffect } from "react";

export default function Page() {
    const [items, setItems] = useState<number[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchMoreItems(page);
    }, [page]);

    const fetchMoreItems = async (page: number) => {
        console.log('fetchMoreItems call, page: ', page)

        // Simulate latency with a timeout
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulating an API call
        const newItems = Array.from({ length: 15 }, (_, i) => i + (page - 1) * 15);
        setItems((prev) => [...prev, ...newItems]);

        // Simulating an endpoint limit
        if (page === 15) setHasMore(false);
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight
        )
        return;
        if (hasMore) setPage((prev) => prev + 1);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore]);

    return (
        <div className="container mx-auto p-4">
          {/* <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> */}
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
          {hasMore && (
            <div className="text-center mt-4">
              <button className="btn btn-primary loading">Loading...</button>
            </div>
          )}
        </div>
    );

}