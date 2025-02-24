"use client"
import DatePicker from "@/components/common/date-picker"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import LoadingMask from "@/components/common/loading-mask"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { getExpenses, PageResponse, StatementResp } from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import dayjs from "dayjs"
import { Fragment, useEffect, useState } from "react"

export default function Page() {
  const [initData, setInitData] = useState<PageResponse<StatementResp> | null>()
  const [date, setDate] = useState("2025-1")
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getData()
  }, [date])
  const getData = async () => {
    const params = {
      page: 1,
      pageSize: 20,
      from_id: 0,
      start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
      end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
    }
    setLoading(true)
    const res = await getExpenses(params)
    setLoading(false)
    setInitData(res)
  }

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: getExpenses,
    params: {
      pageSize: 20,
      from_id: 0,
      start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
      end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
    }
  })
  return (
    <div className="w-full h-[calc(100vh-153px)]">
      {initData && (
        <InfiniteScroll<StatementResp>
          className={"h-full w-full mx-auto"}
          initialItems={initData.list || []}
          initialHasMore={true}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <DatePicker
                defVal="2025-1"
                confirm={(e) => {
                  setDate(e)
                }}
              />
              <div className="p-4 pt-0">
                {items.map((v, i) => (
                  <div key={i} className="py-3 border-b border-spacing-0.5 border-[#ddd]">
                    <div className="flex justify-between">
                      <span>{dayjs(v.trade_time * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
                      <span className="text-xs text-[#323232]">{v.change_amount} USDT</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-[#979799]">余额：{v.balance_snapshot}</span>
                      <span className="text-[#FFA94B]">{v.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
              {isLoading && <ListLoading />}
              {!hasMore && items?.length > 0 && <ListEnd />}
              {(!items || !items?.length) && <Empty top={20} />}
            </Fragment>
          )}
        </InfiniteScroll>
      )}
      <LoadingMask isLoading={loading} />
    </div>
  )
}
