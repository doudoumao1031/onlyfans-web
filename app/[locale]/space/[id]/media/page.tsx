"use client"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import MediaItem from "@/components/space/mediaItem"
import { PageInfo, PageResponse, PostData } from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { Fragment, useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { userMediaPosts } from "@/lib/actions/space"
type FeedParams = PageInfo & {
  user_id: number
  post_status?: number
}
export default function Page() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const { id } = useParams()

  const getInitData = useCallback(async () => {
    const params: FeedParams = {
      page: 1,
      pageSize: 10,
      from_id: 0,
      user_id: Number(id)
    }
    const res = await userMediaPosts(params)
    setInitData(res)
  }, [id])

  useEffect(() => {
    getInitData()
  }, [getInitData])

  useEffect(() => {
    getInitData()
  }, [getInitData])

  const infiniteFetchMedia = useInfiniteFetch({
    fetchFn: userMediaPosts,
    params: {
      pageSize: 10,
      from_id: 0,
      user_id: Number(id)
    }
  })
  return (
    <div className="w-full h-full">
      {initData && (
        <InfiniteScroll<PostData>
          className={"h-full w-full mx-auto"}
          fetcherFn={infiniteFetchMedia}
          initialItems={initData.list}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="w-full flex justify-between flex-wrap">
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
