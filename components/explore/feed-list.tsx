"use client"

import React, { Fragment, useEffect, useRef, useState } from "react"

import Post from "@/components/post/post"
import { usePostUpdates } from "@/hooks/usePostUpdates"
import { PostData } from "@/lib"
import { recomActions } from "@/lib/actions"
import { ActionTypes } from "@/lib/contexts/global-context"

import { ListError, ListLoading, ListEnd } from "./list-states"
import InfiniteScroll from "../common/infinite-scroll"

interface FeedListProps {
  initialItems: PostData[]
  initialHasMore: boolean
}

// Define the custom event interface
interface PostUpdateEvent extends CustomEvent {
  detail: {
    postId: number;
  };
}

export default function FeedList({ initialItems, initialHasMore }: FeedListProps) {
  const scrollToTopFn = useRef<(() => void) | null>(null)
  const refreshFn = useRef<(() => Promise<void>) | null>(null)
  const [itemsMap, setItemsMap] = useState<Map<number, PostData>>(() => {
    // Initialize map with initial items
    const map = new Map<number, PostData>()
    initialItems.forEach(item => {
      map.set(item.post.id, item)
    })
    return map
  })

  // Handle global events
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

  // Use the custom hook for post updates
  const { updatePost } = usePostUpdates(itemsMap, setItemsMap)

  // Listen for individual post update events
  useEffect(() => {
    const handlePostUpdate = async (event: Event) => {
      const customEvent = event as PostUpdateEvent
      const postId = customEvent.detail?.postId
      if (postId) {
        updatePost(postId)
      }
    }

    window.addEventListener(ActionTypes.Feed.UPDATE_POST, handlePostUpdate)

    return () => {
      window.removeEventListener(ActionTypes.Feed.UPDATE_POST, handlePostUpdate)
    }
  }, [updatePost]) // Add updatePost to dependencies

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
              {items.map((item, index) => {
                // Use the updated item from itemsMap if available
                const updatedItem = itemsMap.get(item.post.id) || item
                return (
                  <Post
                    key={`feed_${index}_${updatedItem.post.id}-${updatedItem.post_metric.thumbs_up_count}-${updatedItem.post_metric.comment_count}-${updatedItem.post_metric.tip_count}-${updatedItem.post_metric.share_count}-${updatedItem.post_metric.collection_count}`}
                    data={updatedItem}
                    hasSubscribe
                    hasVote
                  />
                )
              })}
            </div>
            {isLoading && <ListLoading />}
            {!hasMore && items.length > 0 && <ListEnd />}
          </Fragment>
        )
      }}
    </InfiniteScroll>
  )
}
