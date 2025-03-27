"use client"

import React, { Fragment, useEffect, useRef, useState } from "react"

import { useTranslations } from "next-intl"

import Empty from "@/components/explore/empty"
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

export default function FollowedList({ initialItems, initialHasMore }: FeedListProps) {
  const t = useTranslations("Explore")
  const scrollToTopFn = useRef<(() => void) | null>(null)
  const refreshFn = useRef<(() => Promise<void>) | null>(null)
  // Add state for tracking posts and their updates
  const [itemsMap, setItemsMap] = useState<Map<number, PostData>>(new Map())
  const [currentItems, setCurrentItems] = useState<PostData[]>([])

  // Use the custom hook for post updates
  const { updatePost } = usePostUpdates(itemsMap, setItemsMap)

  useEffect(() => {
    const handleScrollTop = () => scrollToTopFn.current?.()
    const handleRefresh = () => refreshFn.current?.()

    window.addEventListener(ActionTypes.Followed.SCROLL_TO_TOP, handleScrollTop)
    window.addEventListener(ActionTypes.Followed.REFRESH, handleRefresh)
    handleRefresh()
    return () => {
      window.removeEventListener(ActionTypes.Followed.SCROLL_TO_TOP, handleScrollTop)
      window.removeEventListener(ActionTypes.Followed.REFRESH, handleRefresh)
    }
  }, [])

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

  return (
    <>
      <InfiniteScroll<PostData>
        initialItems={initialItems}
        initialHasMore={initialHasMore}
        fetcherFn={recomActions.followedList}
      >
        {({ items, isLoading, hasMore, error, refresh, scrollToTop }) => {
          scrollToTopFn.current = scrollToTop
          refreshFn.current = refresh

          // Update itemsMap when items change
          if (JSON.stringify(items.map(i => i.post.id)) !== JSON.stringify(currentItems.map(i => i.post.id))) {
            setCurrentItems(items)

            // Update itemsMap directly when currentItems changes
            setItemsMap(() => {
              const newMap = new Map<number, PostData>()
              items.forEach(item => {
                newMap.set(item.post.id, item)
              })
              return newMap
            })
          }

          return (
            <Fragment>
              {Boolean(error) && <ListError />}
              {(!items || items.length === 0) && <Empty text={t("FollowedEmpty")} />}
              {items && items.length > 0 && (
                <div className="space-y-4 pb-4">
                  {items.map((item) => {
                    // Use the updated item from itemsMap if available
                    const updatedItem = itemsMap.get(item.post.id) || item
                    return (
                      <Post
                        key={`followed_${updatedItem.post.id}-${updatedItem.post_metric.thumbs_up_count}-${updatedItem.post_metric.comment_count}-${updatedItem.post_metric.tip_count}-${updatedItem.post_metric.share_count}-${updatedItem.post_metric.collection_count}`}
                        data={updatedItem}
                        hasSubscribe={false}
                        hasVote={true}
                      />
                    )
                  })}
                  {isLoading && <ListLoading />}
                  {!hasMore && items.length > 0 && <ListEnd />}
                </div>
              )}
            </Fragment>
          )
        }}
      </InfiniteScroll>
    </>
  )
}
