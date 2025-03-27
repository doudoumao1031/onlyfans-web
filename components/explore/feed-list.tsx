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
  const [itemsMap, setItemsMap] = useState<Map<number, PostData>>(new Map())
  // Store current items from InfiniteScroll
  const [currentItems, setCurrentItems] = useState<PostData[]>([])

  // Initialize the map with initial items
  useEffect(() => {
    const newMap = new Map<number, PostData>()
    initialItems.forEach(item => {
      newMap.set(item.post.id, item)
    })
    setItemsMap(newMap)
  }, [initialItems])

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

        // Update the current items state when the items from InfiniteScroll change
        if (JSON.stringify(items.map(i => i.post.id)) !== JSON.stringify(currentItems.map(i => i.post.id))) {
          setCurrentItems(items)

          // Update itemsMap directly when currentItems changes
          setItemsMap(prevMap => {
            const newMap = new Map<number, PostData>()
            items.forEach(item => {
              // Preserve any updated items we already have in the map
              if (prevMap.has(item.post.id)) {
                newMap.set(item.post.id, prevMap.get(item.post.id)!)
              } else {
                newMap.set(item.post.id, item)
              }
            })
            return newMap
          })
        }

        // Convert the map back to an array for rendering
        const displayItems = items.map(item => {
          // Use the updated post data from the map if available
          return itemsMap.get(item.post.id) || item
        })

        return (
          <Fragment>
            {Boolean(error) && <ListError />}
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-4">
              {displayItems.map((item) => (
                <Post
                  key={`${item.post.id}-${item.post_metric.thumbs_up_count}-${item.post_metric.comment_count}-${item.post_metric.tip_count}-${item.post_metric.share_count}-${item.post_metric.collection_count}`}
                  data={item}
                  hasSubscribe
                  hasVote
                />
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
