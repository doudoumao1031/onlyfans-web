"use client"

import React, { Fragment, useEffect, useRef, useState } from "react"

import Post from "@/components/post/post"
import { PostData } from "@/lib"
import { recomActions } from "@/lib/actions"
import { postDetail } from "@/lib/actions/profile"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"

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
  // Add a state to force re-render when a post is updated
  const [updatedPostIds, setUpdatedPostIds] = useState<Set<number>>(new Set())
  const { actionQueue } = useGlobal()
  // Track processed post IDs to prevent duplicate API calls
  const processedPostIds = useRef<Set<number>>(new Set())
  // Track the last action to prevent duplicate processing
  const lastProcessedActionRef = useRef<number>(-1)
  // Store current items from InfiniteScroll
  const [currentItems, setCurrentItems] = useState<PostData[]>(initialItems)

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

  // Function to update a specific post
  const updatePost = async (postId: number) => {
    if (!postId || !itemsMap.has(postId)) return

    // Skip if we've already processed this post ID recently
    if (processedPostIds.current.has(postId)) return

    // Add to processed set with a timeout to clear it after a while
    processedPostIds.current.add(postId)
    setTimeout(() => {
      processedPostIds.current.delete(postId)
    }, 2000) // Prevent duplicate calls within 2 seconds

    try {
      console.log(`Fetching updated data for post ${postId}`)
      const res = await postDetail(postId)
      if (res?.data) {
        console.log(`Successfully updated post ${postId}`)

        // Update the map with the new post data
        setItemsMap(prevMap => {
          const newMap = new Map(prevMap)
          newMap.set(postId, res.data as unknown as PostData)
          return newMap
        })

        // Add to updated post IDs to force re-render
        setUpdatedPostIds(prev => {
          const newSet = new Set(prev)
          newSet.add(postId)
          return newSet
        })
      }
    } catch (error) {
      console.error("Failed to update post:", error)
    }
  }

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
  }, []) // Keep empty dependency array to prevent re-registering

  // Watch for post update actions in the global action queue
  useEffect(() => {
    if (actionQueue.length === 0) return

    const currentActionIndex = actionQueue.length - 1
    // Skip if we've already processed this action
    if (lastProcessedActionRef.current === currentActionIndex) return

    const latestAction = actionQueue[currentActionIndex]
    if (latestAction?.type === ActionTypes.Feed.UPDATE_POST && latestAction.payload) {
      const postId = Number(latestAction.payload)

      // Update the last processed action index
      lastProcessedActionRef.current = currentActionIndex

      if (itemsMap.has(postId)) {
        console.log(`Processing update action for post ${postId}`)
        // Directly update the post instead of dispatching an event
        updatePost(postId)
      }
    }
  }, [actionQueue]) // Remove itemsMap from dependencies to prevent unnecessary re-runs

  // Update the items map when new items are loaded
  useEffect(() => {
    setItemsMap(prevMap => {
      const newMap = new Map<number, PostData>()
      currentItems.forEach(item => {
        // Preserve any updated items we already have in the map
        if (prevMap.has(item.post.id)) {
          newMap.set(item.post.id, prevMap.get(item.post.id)!)
        } else {
          newMap.set(item.post.id, item)
        }
      })
      return newMap
    })
  }, [currentItems]) // Only depend on currentItems

  // Log the updated posts for debugging
  useEffect(() => {
    if (updatedPostIds.size > 0) {
      console.log("Updated posts in render:", Array.from(updatedPostIds))
    }
  }, [updatedPostIds])

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
              {displayItems.map((item, index) => (
                <Post
                  // Update the key to include updatedPostIds size to force re-render when posts are updated
                  key={`${item.post.id}-${index}-${item.post_metric.thumbs_up_count}-${item.post_metric.comment_count}-${item.post_metric.tip_count}-${item.post_metric.share_count}-${item.post_metric.collection_count}-${updatedPostIds.size}`}
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
