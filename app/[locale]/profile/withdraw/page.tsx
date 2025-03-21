"use client"
import { useState, useEffect, Suspense, Fragment } from "react"

import dayjs from "dayjs"
import { useTranslations } from "next-intl"

import DatePicker from "@/components/common/date-picker"
import Empty from "@/components/common/empty"
import Header from "@/components/common/header"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { PageResponse, userWalletDownOrder, WithdrawOrder } from "@/lib"
import { ZH_YYYY_MM, ZH_YYYY_MM_DD_HH_mm_ss } from "@/lib/constant"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"


export default function Page() {
  const t = useTranslations("Profile.withdrawOrder")
  const [list, setList] = useState<PageResponse<WithdrawOrder> | null>()
  const [date, setDate] = useState<string>(dayjs().format(ZH_YYYY_MM))
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
        <div className="h-[calc(100vh-49px)] w-full">
          <DatePicker
            defVal={date}
            confirm={(e) => {
              setDate(e)
            }}
          />
          {list && (
            <InfiniteScroll<WithdrawOrder>
              className={"mx-auto size-full"}
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
                        <div key={i} className="border-spacing-0.5 border-b border-[#ddd] py-3">
                          <div className="flex justify-between">
                            <span>{dayjs(v.create_time * 1000).format(ZH_YYYY_MM_DD_HH_mm_ss)}</span>
                            <span className="text-xs text-[#323232]">{v.amount} USDT</span>
                          </div>
                          <div className="mt-1 flex justify-end text-xs">
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
