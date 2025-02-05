"use client"

import React, { Fragment } from "react"
import Post from "@/components/post/post"
import InfiniteScroll from "../common/infinite-scroll"
import { ListError, ListLoading, ListEnd } from "@/components/explore/list-states"
import { PostData, PageInfo } from "@/lib"
import { getMyFeeds, getUserPosts } from "@/lib/actions/space"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"

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
          <div className="max-w-lg mx-auto grid grid-cols-1 gap-4">
            {items.map((item, index) => (
              <Post key={`${item.post.id}-${index}`} data={item} showSubscribe showVote />
            ))}
          </div>
          {isLoading && <ListLoading />}
          {!hasMore && items.length > 0 && <ListEnd />}
        </Fragment>
      )}
    </InfiniteScroll>
  )
}
