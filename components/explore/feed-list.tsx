"use client"

import React, { Fragment } from "react"
import Post from "@/components/post/post"
import InfiniteScroll from "../common/infinite-scroll"
import { ListError, ListLoading, ListEnd } from "./list-states"
import { PostData } from "@/lib"
import { fetchFeeds } from "@/lib/data"

interface FeedListProps {
  initialItems: PostData[]
  initialHasMore: boolean
}

export default function FeedList({ initialItems, initialHasMore }: FeedListProps) {
  return (
    <InfiniteScroll<PostData>
      initialItems={initialItems}
      initialHasMore={initialHasMore}
      fetcherFn={fetchFeeds}
    >
      {({ items, isLoading, hasMore, error }) => (
        <Fragment>
          {Boolean(error) && <ListError />}
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
          {isLoading && <ListLoading />}
          {!hasMore && items.length > 0 && <ListEnd />}
        </Fragment>
      )}
    </InfiniteScroll>
  )
}
