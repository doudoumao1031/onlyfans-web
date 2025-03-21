"use client"
import { useState, useEffect, Suspense, Fragment } from "react"

import dayjs from "dayjs"
import { useTranslations } from "next-intl"

import DatePicker from "@/components/common/date-picker"
import Empty from "@/components/common/empty"
import Header from "@/components/common/header"
import InfiniteScroll from "@/components/common/infinite-scroll"
import LazyImg from "@/components/common/lazy-img"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { PageResponse, StatementResp, userStatement } from "@/lib"
import { ZH_YYYY_MM, ZH_YYYY_MM_DD_HH_mm_ss } from "@/lib/constant"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"

export default function Page() {
  const t = useTranslations("Profile.recharge")
  const [list, setList] = useState<PageResponse<StatementResp> | null>()
  const [date, setDate] = useState<string>(dayjs().format(ZH_YYYY_MM))
  const { withLoading } = useLoadingHandler({})
  useEffect(() => {
    const statementList = async () => {
      await withLoading(async () => {
        try {
          const list = await userStatement({
            change_type: 1,
            pageSize: 20,
            page: 1,
            from_id: 0,
            start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
            end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
          })
          setList(list)
        } catch (error) {
          console.error("Error fetching withdraw:", error)
        }
      })
    }
    statementList()
  }, [date])

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: userStatement,
    params: {
      change_type: 1,
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
        {list && (
          <div className="h-[calc(100vh-49px)] w-full">
            <DatePicker
              defVal={date}
              confirm={(e) => {
                setDate(e)
              }}
            />
            <InfiniteScroll<StatementResp>
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
                          { color: "text-[#19B370]", value: t("tradeSuccess") },
                          { color: "text-[#00AEF3]", value: t("reviewing") },
                          { color: "text-[#FF3E3E]", value: t("failed") }
                        ]
                        return (
                          <div key={i} className="border-spacing-0.5 border-b border-[#ddd] py-3">
                            <div className={"mb-2.5 flex justify-between"}>
                              <span>{t("digitalWallet")}</span>
                              <span className={`${types[v.trade_status].color}`}>
                                {types[v.trade_status].value}
                              </span>
                            </div>
                            <div className={"flex items-center justify-start"}>
                              <div className={"mr-2 size-10"}>
                                <LazyImg src={"/theme/icon_wallet_digital@3x.png"} height={40} width={40} alt={""} />
                              </div>
                              <div className={"flex w-full flex-col"}>
                                <div className="flex items-center justify-between">
                                  <span className="text-[13px] text-[#777777]">{t("tradeNo")}: {v.trade_no}</span>
                                  <span className="text-base text-[#222222]">{new Intl.NumberFormat().format(v.change_amount)}</span>
                                </div>
                                <div className="mt-1.5 flex justify-between text-xs text-[#979799]">
                                  <span>{dayjs(v.trade_time * 1000).format(ZH_YYYY_MM_DD_HH_mm_ss)}</span>
                                  <span>{t("balance")}: {new Intl.NumberFormat().format(v.balance_snapshot)}</span>
                                </div>
                              </div>
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
          </div>
        )}
      </Suspense>
    </div>
  )
}
