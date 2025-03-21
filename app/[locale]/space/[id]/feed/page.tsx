"use client"

import React, { Fragment, useEffect, useState } from "react"

import { useParams } from "next/navigation"

import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListError, ListLoading, ListEnd } from "@/components/explore/list-states"
import Post from "@/components/post/post"
import { PageResponse, PostData, PageInfo } from "@/lib"
import { getUserPosts } from "@/lib/actions/space"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"



type FeedParams = PageInfo & {
  user_id: number
  post_status?: number
}

export default function FeedList() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const { id } = useParams()
  useEffect(() => {
    getUserPosts({
      page: 1,
      pageSize: 10,
      from_id: 0,
      user_id: Number(id),
      post_status: 1
    } as FeedParams).then(res => {
      setInitData(res)
    })
  }, [id])

  const infiniteFetchPosts = useInfiniteFetch<FeedParams, PostData>({
    fetchFn: getUserPosts,
    params: {
      pageSize: 10,
      from_id: 0,
      user_id: Number(id),
      post_status: 1
    }
  })
  return (
    <div className="size-full">
      {initData && (
        <InfiniteScroll<PostData>
          className={"mx-auto size-full"}
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="mx-auto grid max-w-lg grid-cols-1 gap-4">
                {items.map((item, index) => (
                  <Post
                    key={`${item.post.id}-${index}`}
                    data={item}
                    hasSubscribe={false}
                    hasVote
                    space
                    isInfoPage={false}
                  />
                ))}
              </div>
              {isLoading && <ListLoading />}
              {!hasMore && items.length > 0 && <ListEnd />}
              {(!items || !items.length) && <Empty top={20} />}
            </Fragment>
          )}
        </InfiniteScroll>
      )}
    </div>
  )
}
