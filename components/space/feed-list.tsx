"use client"

import React, { Fragment, useEffect, useState } from "react"

import { ListError, ListLoading, ListEnd } from "@/components/explore/list-states"
import Post from "@/components/post/post"
import { usePostUpdates } from "@/hooks/usePostUpdates"
import { PostData, PageInfo } from "@/lib"
import { getMyFeeds, getUserPosts } from "@/lib/actions/space"
import { ActionTypes } from "@/lib/contexts/global-context"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"

import InfiniteScroll from "../common/infinite-scroll"

interface FeedListProps {
  initialItems: PostData[]
  initialHasMore: boolean
  id: string
  isSelf: boolean
}

type FeedParams = PageInfo & {
  user_id: number
}

export default function FeedList({ initialItems, initialHasMore, isSelf, id }: FeedListProps) {
  // Add state for tracking posts and their updates
  const [itemsMap, setItemsMap] = useState<Map<number, PostData>>(() => {
    // Initialize map with initial items
    const map = new Map<number, PostData>()
    initialItems.forEach(item => {
      map.set(item.post.id, item)
    })
    return map
  })

  // Use the custom hook for post updates
  const { updatePost } = usePostUpdates(itemsMap, setItemsMap)

  // Listen for individual post update events
  useEffect(() => {
    const handlePostUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent<{ postId: number }>
      const postId = customEvent.detail?.postId
      if (postId) {
        updatePost(postId)
      }
    }

    window.addEventListener(ActionTypes.Feed.UPDATE_POST, handlePostUpdate)

    return () => {
      window.removeEventListener(ActionTypes.Feed.UPDATE_POST, handlePostUpdate)
    }
  }, [updatePost])

  const infiniteFetchPosts = useInfiniteFetch<FeedParams, PostData>({
    fetchFn: !isSelf ? getMyFeeds : getUserPosts,
    params: {
      pageSize: 10,
      from_id: 0,
      user_id: Number(id)
    }
  })
  return (
    <InfiniteScroll<PostData>
      initialItems={initialItems}
      initialHasMore={initialHasMore}
      fetcherFn={infiniteFetchPosts}
    >
      {({ items, isLoading, hasMore, error }) => {

        return (
          <Fragment>
            {Boolean(error) && <ListError />}
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-4">
              {items.map((item, index) => {
                // Use the updated item from itemsMap if available
                const updatedItem = itemsMap.get(item.post.id) || item
                return (
                  <Post
                    key={`space_${index}_${updatedItem.post.id}-${updatedItem.post_metric.thumbs_up_count}-${updatedItem.post_metric.comment_count}-${updatedItem.post_metric.tip_count}-${updatedItem.post_metric.share_count}-${updatedItem.post_metric.collection_count}`}
                    data={updatedItem}
                    hasVote
                    hasSubscribe
                    space
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
