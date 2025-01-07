"use client"

import React, {Fragment} from "react"
import Post from "@/components/post/post"
import InfiniteScroll from "../common/infinite-scroll"
import {ListError, ListLoading, ListEnd} from "./list-states"
import {PostData} from "@/components/post/type"

interface FeedListProps {
    initialItems: PostData[]
    initialHasMore: boolean
}

export default function FeedList({initialItems, initialHasMore}: FeedListProps) {
    return (
        <InfiniteScroll
            initialItems={initialItems}
            initialHasMore={initialHasMore}
        >
            {({items, isLoading, hasMore, error}) => (
                <Fragment>
                    {Boolean(error) && <ListError/>}
                    <div className="max-w-lg mx-auto grid grid-cols-1 gap-4">
                        {items.map((item, index) => (
                            <Post
                                key={`${item.post.id}-${index}`}
                                data={item}
                                showSubscribe
                                showVote
                            />
                        ))}
                    </div>
                    {isLoading && <ListLoading/>}
                    {!hasMore && <ListEnd/>}
                </Fragment>
            )}
        </InfiniteScroll>
    )
}
