"use client"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import MediaItem from "@/components/space/mediaItem"
import { myMediaPosts, PageResponse, PostData } from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { Fragment, useEffect, useState } from "react"

export default function Page(params: Promise<{ id: string }>) {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  useEffect(() => {
    myMediaPosts({
      page: 1,
      pageSize: 10,
      from_id: 0
    }).then((response) => {
      console.log(response)
      setInitData(response)
    })
  }, [])
  const infiniteFetchMedia = useInfiniteFetch({
    fetchFn: myMediaPosts,
    params: {
      pageSize: 10,
      from_id: 0
    }
  })
  return (
    <div className="">
      {/* {mockData.map((v, i) => {
        return <MediaItem item={v} key={i} />
      })} */}

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
                  <MediaItem id={id} item={item} key={index} />
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
