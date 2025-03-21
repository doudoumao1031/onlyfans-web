"use client"

import React, { Fragment } from "react"

import { ListError, ListLoading, ListEnd } from "@/components/explore/list-states"
import Post from "@/components/post/post"
import { PostData, PageInfo } from "@/lib"
import { getMyFeeds, getUserPosts } from "@/lib/actions/space"
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
      {({ items, isLoading, hasMore, error }) => (
        <Fragment>
          {Boolean(error) && <ListError />}
          <div className="mx-auto grid max-w-lg grid-cols-1 gap-4">
            {items.map((item, index) => (
              <Post key={`${item.post.id}-${index}`} data={item} hasVote hasSubscribe />
            ))}
          </div>
          {isLoading && <ListLoading />}
          {!hasMore && items.length > 0 && <ListEnd />}
        </Fragment>
      )}
    </InfiniteScroll>
  )
}
