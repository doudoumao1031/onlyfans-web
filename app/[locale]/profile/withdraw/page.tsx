"use client"
import Header from "@/components/common/header"
import Empty from "@/components/common/empty"
import { PageResponse, userWalletDownOrder, WithdrawOrder } from "@/lib"
import dayjs from "dayjs"
import { useState, useEffect, Suspense, Fragment } from "react"
import DatePicker from "@/components/common/date-picker"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("Profile.withdrawOrder")
  const [list, setList] = useState<PageResponse<WithdrawOrder> | null>()
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM"))
  const { withLoading } = useLoadingHandler({})
  useEffect(() => {
    const statementList = async () => {
      await withLoading(async () => {
        try {
          const list = await userWalletDownOrder({
            pageSize: 20,
            page: 1,
            from_id: 0,
            start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
            end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
          })
          setList(list)
          console.log("list", list)
        } catch (error) {
          console.error("Error fetching withdraw:", error)
        }
      })
    }
    statementList()
  }, [date])

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: userWalletDownOrder,
    params: {
      pageSize: 20,
      from_id: 0,
      start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
      end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
    }
  })

  return (
    <div>
      <Header title={t("title")} titleColor="#000" />
      <Suspense fallback={<div className="flex justify-center p-4">Loading...</div>}>
        <div className="w-full h-[calc(100vh-49px)]">
          <DatePicker
            defVal={date}
            confirm={(e) => {
              setDate(e)
            }}
          />
          {list && (
            <InfiniteScroll<WithdrawOrder>
              className={"h-full w-full mx-auto"}
              initialItems={list.list || []}
              initialHasMore={true}
              fetcherFn={infiniteFetchPosts}
            >
              {({ items, isLoading, hasMore, error }) => (
                <Fragment>
                  {Boolean(error) && <ListError />}
                  <div className="p-4 pt-0">
                    {items.map((v, i) => {
                      const types = [
                        { color: "text-[#FFA94B]", value: t("reviewing") },
                        { color: "text-[#0DC28A]", value: t("success") },
                        { color: "text-[#BBBBBB]", value: t("failed") }
                      ]
                      return (
                        <div key={i} className="py-3 border-b border-spacing-0.5 border-[#ddd]">
                          <div className="flex justify-between">
                            <span>{dayjs(v.create_time * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
                            <span className="text-xs text-[#323232]">{v.amount} USDT</span>
                          </div>
                          <div className="flex justify-end text-xs mt-1">
                            {/*<span className="text-[#979799]">
                              {t("balance")}：{v.balance_snapshot}
                            </span>*/}
                            <span className={`${types[v.trade_status].color}`}>
                              {types[v.trade_status].value}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {isLoading && <ListLoading />}
                  {!hasMore && items?.length > 0 && <ListEnd />}
                  {(!items || !items?.length) && <Empty top={20} />}
                </Fragment>
              )}
            </InfiniteScroll>
          )}
        </div>
      </Suspense>
    </div>
  )
}
