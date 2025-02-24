"use client"
import Header from "@/components/common/header"
import Empty from "@/components/common/empty"
import { PageResponse, StatementResp, userStatement } from "@/lib"
import dayjs from "dayjs"
import { useState, useEffect, Suspense, Fragment } from "react"
import { useSearchParams } from "next/navigation"
import DatePicker from "@/components/common/date-picker"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"

export default function Page() {
  const searchParams = useSearchParams()
  const changeType = Number(searchParams.get("changeType"))
  const [list, setList] = useState<PageResponse<StatementResp> | null>()
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM"))
  const { withLoading } = useLoadingHandler({
  })
  useEffect(() => {
    console.log("useEffect called with changeType:", changeType)
    const statementList = async () => {
      await withLoading(async () => {
        try {
          const list = await userStatement({
            change_type: changeType,
            pageSize: 20,
            page: 1,
            from_id: 0,
            start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
            end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
          })
          setList(list)
        } catch (error) {
          console.error("Error fetching statement:", error)
        }
      })
    }
    statementList()
  }, [changeType, date])

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: userStatement,
    params: {
      change_type: changeType,
      pageSize: 20,
      from_id: 0,
      start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
      end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
    }
  })

  return (
    <div>
      <Header title={changeType === 1 ? "充值明细": "提现明细"} titleColor="#000"/>
      <Suspense fallback={<div className="flex justify-center p-4">Loading...</div>}>
        <div className="w-full h-[calc(100vh-153px)]">
          {list && (
            <InfiniteScroll<StatementResp>
              className={"h-full w-full mx-auto"}
              initialItems={list.list || []}
              initialHasMore={true}
              fetcherFn={infiniteFetchPosts}
            >
              {({ items, isLoading, hasMore, error }) => (
                <Fragment>
                  {Boolean(error) && <ListError/>}
                  <DatePicker
                    defVal={date}
                    confirm={(e) => {
                      setDate(e)
                    }}
                  />
                  <div className="p-4 pt-0">
                    {items.map((v, i) => {
                      const types = [
                        { color: "text-[#0DC28A]", value: "成功" },
                        { color: "text-[#FFA94B]", value: "审核中" },
                        { color: "text-[#BBBBBB]", value: "失败" }
                      ]
                      return (
                        <div key={i} className="mb-4">
                          <div className="flex justify-between">
                            <span>{dayjs(v.trade_time * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
                            <span className="text-xs text-[#323232]">{v.change_amount} USDT</span>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-[#979799]">余额：{v.balance_snapshot}</span>
                            <span className={`${types[v.trade_status].color}`}>
                              {types[v.trade_status].value}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {isLoading && <ListLoading/>}
                  {!hasMore && items?.length > 0 && <ListEnd/>}
                  {(!items || !items?.length) && <Empty top={20}/>}
                </Fragment>
              )}
            </InfiniteScroll>
          )}
        </div>
      </Suspense>
    </div>
  )
}
