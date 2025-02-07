"use client"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import FeedItem from "@/components/profile/dataCenter/feedItem"
import InputWithLabel from "@/components/profile/input-with-label"
import { PageResponse, PostData } from "@/lib"
import { getMyFeeds } from "@/lib/actions/space"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"


const filterTypes = [
  { label: "最新发布", value: 0 },
  { label: "总播放量", value: 1 },
  { label: "总评论", value: 2 },
  { label: "总点赞", value: 3 }
]
export default function Page() {
  const queryString = useSearchParams()
  const id = queryString.get("id")
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const [type, setType] = useState<number>(0)

  const getData = async (extraParams = {}) => {
    const params = {
      page: 1,
      pageSize: 10,
      from_id: 0,
      sort_type: type,
      ...extraParams
    }
    const res = await getMyFeeds(params)
    setInitData(res)
  }

  useEffect(() => {
    if (!id) {
      getData()
    } else {
      getData({ from_id: Number(id) })
    }
  }, [])

  const title = useMemo(() => {
    const cur = filterTypes.find(v => v.value === type)
    return cur ? cur.label : "最新发布"
  }, [type])

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: getMyFeeds,
    params: {
      pageSize: 10,
      from_id: 0,
      sort_type: type
    }
  })
  return (
    <div className="">
      {initData && id && initData?.list?.length && (
        <>
          <FeedItem item={initData.list?.[0]} />
        </>
      )}
      {initData && !id && (
        <InfiniteScroll<PostData>
          className={"h-full w-full mx-auto"}
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="flex justify-between mb-4 px-4">
                <div className="flex items-end">
                  <h1 className="text-base font-medium">帖子列表</h1>
                  <div className="ml-2 text-[#BBB] text-xs ">{`展示${title}的前20个帖子`}</div>
                </div>
                <InputWithLabel
                  placeholder={"日期范围"}
                  labelClass="border-0 pl-0 pr-0 pb-0 pt-[0px] text-[#6D7781]"
                  iconSize={16}
                  onInputChange={(e) => {
                    setType(e as number)
                  }}
                  options={filterTypes}
                  value={type}
                />
              </div>
              {items.map((v, i) => (
                <FeedItem key={i} item={v} />
              ))}
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