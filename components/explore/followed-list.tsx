"use client"

import React, { Fragment } from "react"
import Post from "@/components/post/post"
import InfiniteScroll from "../common/infinite-scroll"
import { ListError, ListLoading, ListEnd } from "./list-states"
import { PostData } from "@/lib"
import { recomActions } from "@/lib/actions"
import Empty from "@/components/explore/empty"
import { useTranslations } from "next-intl"

interface FeedListProps {
  initialItems: PostData[]
  initialHasMore: boolean
}

export default function FollowedList({ initialItems, initialHasMore }: FeedListProps) {
  const t = useTranslations("Explore")
  return (
    <>
      <InfiniteScroll<PostData>
        initialItems={initialItems}
        initialHasMore={initialHasMore}
        fetcherFn={recomActions.followedList}
      >
        {({ items, isLoading, hasMore, error }) => (
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
        )}
      </InfiniteScroll>
    </>
  )
}
