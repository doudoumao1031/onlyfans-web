"use client"
import { Fragment, useEffect, useState } from "react"

import { useParams } from "next/navigation"

import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import MediaItem from "@/components/space/mediaItem"
import { PageInfo, PageResponse, PostData } from "@/lib"
import { userMediaPosts } from "@/lib/actions/space"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"


type FeedParams = PageInfo & {
  user_id: number
  post_status?: number
}
export default function Page() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const { id } = useParams()

  useEffect(() => {
    const params: FeedParams = {
      page: 1,
      pageSize: 10,
      from_id: 0,
      user_id: Number(id)
    }
    userMediaPosts(params)
      .then(res => {
        setInitData(res)
      })
  }, [id])

  const infiniteFetchMedia = useInfiniteFetch({
    fetchFn: userMediaPosts,
    params: {
      pageSize: 10,
      from_id: 0,
      user_id: Number(id)
    }
  })
  return (
    <div className="size-full px-4">
      {initData && (
        <InfiniteScroll<PostData>
          className={"mx-auto size-full"}
          fetcherFn={infiniteFetchMedia}
          initialItems={initData.list}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="flex w-full flex-wrap justify-between">
                {items?.map((item, index) => (
                  <MediaItem item={item} key={index} />
                ))}
              </div>
              {isLoading && <ListLoading />}
              {!hasMore && items?.length > 0 && <ListEnd />}
              {(!items || !items.length) && <Empty top={20} />}
            </Fragment>
          )}
        </InfiniteScroll>
      )}
    </div>
  )
}
