"use client"

import React, { Fragment } from "react"
import Post from "@/components/post/post"
import { postData } from "../post/mock"
import InfiniteScroll from "../common/infinite-scroll"
import { ListError, ListLoading, ListEnd } from "./list-states"

interface FeedListProps {
  initialItems: typeof postData[]
  initialHasMore: boolean
}

export default function FeedList({ initialItems, initialHasMore }: FeedListProps) {
  return (
    <InfiniteScroll<typeof postData>
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
                key={`${item.id}-${index}`} 
                data={item} 
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
