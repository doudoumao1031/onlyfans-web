"use client"

import React, { Fragment } from "react"
import Post from "@/components/post/post"
import { postData } from "../post/mock"
import InfiniteScroll from "../common/infinite-scroll"
import { ListError, ListLoading, ListEnd } from "../common/list-states"

interface FeedListProps {
  initialItems: number[]
  initialHasMore: boolean
}

export default function FeedList({ initialItems, initialHasMore }: FeedListProps) {
  return (
    <InfiniteScroll<number>
      url="/api/feeds"
      initialItems={initialItems}
      initialHasMore={initialHasMore}
    >
      {({ items, isLoading, hasMore, error }) => (
        <Fragment>
          {Boolean(error) && <ListError />}
          <div className="max-w-lg mx-auto grid grid-cols-1 gap-4">
            {items.map((item, index) => (
              <Post 
                key={`${item}-${index}`} 
                data={postData} 
                showSubscribe 
                showVote 
              />
            ))}
          </div>
          {isLoading && <ListLoading />}
          {!hasMore && <ListEnd />}
        </Fragment>
      )}
    </InfiniteScroll>
  )
}
