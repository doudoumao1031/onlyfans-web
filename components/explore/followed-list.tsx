"use client"

import React, { Fragment, useEffect, useRef } from "react"
import Post from "@/components/post/post"
import InfiniteScroll from "../common/infinite-scroll"
import { ListError, ListLoading, ListEnd } from "./list-states"
import { PostData } from "@/lib"
import { recomActions } from "@/lib/actions"
import Empty from "@/components/explore/empty"
import { useTranslations } from "next-intl"
import { ActionTypes } from "@/lib/contexts/global-context"

interface FeedListProps {
  initialItems: PostData[]
  initialHasMore: boolean
}

export default function FollowedList({ initialItems, initialHasMore }: FeedListProps) {
  const t = useTranslations("Explore")
  const scrollToTopFn = useRef<(() => void) | null>(null)
  const refreshFn = useRef<(() => Promise<void>) | null>(null)
  useEffect(() => {
    const handleScrollTop = () => scrollToTopFn.current?.()
    const handleRefresh = () => refreshFn.current?.()

    window.addEventListener(ActionTypes.Followed.SCROLL_TO_TOP, handleScrollTop)
    window.addEventListener(ActionTypes.Followed.REFRESH, handleRefresh)

    return () => {
      window.removeEventListener(ActionTypes.Followed.SCROLL_TO_TOP, handleScrollTop)
      window.removeEventListener(ActionTypes.Followed.REFRESH, handleRefresh)
    }
  }, [])
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
          return (
            <Fragment>
              {Boolean(error) && <ListError />}
              {(!items || items.length === 0) && <Empty text={t("FollowedEmpty")} />}
              {items && items.length > 0 && (
                <div className="max-w-lg mx-auto grid grid-cols-1 gap-4">
                  {items.map((item, index) => (
                    <Post key={`${item.post.id}-${index}`} data={item} hasSubscribe hasVote />
                  ))}
                </div>
              )}
              {isLoading && <ListLoading />}
              {!hasMore && items && items.length > 0 && <ListEnd />}
            </Fragment>
          )
        }}
      </InfiniteScroll>
    </>
  )
}
