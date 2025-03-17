"use client"
import Header from "@/components/common/header"
import Empty from "@/components/common/empty"
import { PageResponse, StatementResp, userStatement } from "@/lib"
import dayjs from "dayjs"
import { useState, useEffect, Suspense, Fragment } from "react"
import DatePicker from "@/components/common/date-picker"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { useTranslations } from "next-intl"
import LazyImg from "@/components/common/lazy-img"
import { ZH_YYYY_MM, ZH_YYYY_MM_DD_HH_mm_ss } from "@/lib/constant"

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
          <div className="w-full h-[calc(100vh-49px)]">
            <DatePicker
              defVal={date}
              confirm={(e) => {
                setDate(e)
              }}
            />
            <InfiniteScroll<StatementResp>
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
                          { color: "text-[#19B370]", value: t("tradeSuccess") },
                          { color: "text-[#00AEF3]", value: t("reviewing") },
                          { color: "text-[#FF3E3E]", value: t("failed") }
                        ]
                        return (
                          <div key={i} className="py-3 border-b border-spacing-0.5 border-[#ddd]">
                            <div className={"flex justify-between mb-2.5"}>
                              <span>{t("digitalWallet")}</span>
                              <span className={`${types[v.trade_status].color}`}>
                                {types[v.trade_status].value}
                              </span>
                            </div>
                            <div className={"flex justify-start items-center"}>
                              <div className={"w-10 h-10 mr-2"}>
                                <LazyImg src={"/theme/icon_wallet_digital@3x.png"} height={40} width={40} alt={""} />
                              </div>
                              <div className={"flex flex-col w-full"}>
                                <div className="flex justify-between items-center">
                                  <span className="text-[13px] text-[#777777]">{t("tradeNo")}: {v.trade_no}</span>
                                  <span className="text-[#222222] text-base">{new Intl.NumberFormat().format(v.change_amount)}</span>
                                </div>
                                <div className="flex justify-between text-xs mt-1.5 text-[#979799]">
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
