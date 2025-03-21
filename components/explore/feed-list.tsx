"use client"

import React, { Fragment, useEffect, useRef } from "react"

import Post from "@/components/post/post"
import { PostData } from "@/lib"
import { recomActions } from "@/lib/actions"
import { ActionTypes } from "@/lib/contexts/global-context"

import { ListError, ListLoading, ListEnd } from "./list-states"
import InfiniteScroll from "../common/infinite-scroll"

interface FeedListProps {
  initialItems: PostData[]
  initialHasMore: boolean
}

export default function FeedList({ initialItems, initialHasMore }: FeedListProps) {
  const scrollToTopFn = useRef<(() => void) | null>(null)
  const refreshFn = useRef<(() => Promise<void>) | null>(null)

  useEffect(() => {
    const handleScrollTop = () => scrollToTopFn.current?.()
    const handleRefresh = () => refreshFn.current?.()

    window.addEventListener(ActionTypes.Feed.SCROLL_TO_TOP, handleScrollTop)
    window.addEventListener(ActionTypes.Feed.REFRESH, handleRefresh)

    return () => {
      window.removeEventListener(ActionTypes.Feed.SCROLL_TO_TOP, handleScrollTop)
      window.removeEventListener(ActionTypes.Feed.REFRESH, handleRefresh)
    }
  }, [])

  return (
    <InfiniteScroll<PostData>
      initialItems={initialItems}
      initialHasMore={initialHasMore}
      fetcherFn={recomActions.fetchFeeds}
    >
      {({ items, isLoading, hasMore, error, refresh, scrollToTop }) => {
        scrollToTopFn.current = scrollToTop
        refreshFn.current = refresh
        return (
          <Fragment>
            {Boolean(error) && <ListError />}
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-4">
              {items.map((item, index) => (
                <Post key={`${item.post.id}-${index}`} data={item} hasSubscribe hasVote />
              ))}
            </div>
            {isLoading && <ListLoading />}
            {!hasMore && items.length > 0 && <ListEnd />}
          </Fragment>
        )
      }}
    </InfiniteScroll>
  )
}
