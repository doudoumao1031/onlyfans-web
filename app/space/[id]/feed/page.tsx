"use client"

import React, { Fragment, useEffect, useState } from "react"
import Post from "@/components/post/post"

import { ListError, ListLoading, ListEnd } from "@/components/explore/list-states"
import { PageResponse, PostData, PageInfo } from "@/lib"
import { getMyFeeds, getUserPosts } from "@/lib/actions/space"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { useParams } from "next/navigation"
import Empty from "@/components/common/empty"

type FeedParams = PageInfo & {
  user_id: number
  post_status?: number
}

export default function FeedList() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const { id } = useParams()
  const [userId, selfId] = (id as string).split("_")
  console.log("userId", userId)

  useEffect(() => {
    getInitData()
  }, [])
  const getInitData = async () => {
    const params: FeedParams = {
      page: 1,
      pageSize: 10,
      from_id: 0,
      user_id: Number(userId),
      post_status: 1
    }
    const res = selfId ? await getMyFeeds(params) : await getUserPosts(params)
    setInitData(res)
  }
  const infiniteFetchPosts = useInfiniteFetch<FeedParams, PostData>({
    fetchFn: selfId ? getMyFeeds : getUserPosts,
    params: {
      pageSize: 10,
      from_id: 0,
      user_id: Number(userId),
      post_status: 1
    }
  })
  return (
    <div className="">
      {initData && (
        <InfiniteScroll<PostData>
          className={"h-full w-full mx-auto"}
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="max-w-lg mx-auto grid grid-cols-1 gap-4">
                {items.map((item, index) => (
                  <Post
                    key={`${item.post.id}-${index}`}
                    data={item}
                    hasSubscribe={false}
                    hasVote
                    id={id as string}
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
