"use client"
import DatePicker from "@/components/common/date-picker"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import LoadingMask from "@/components/common/loading-mask"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { ChangeType, ChangeTypeDesc, getExpenses, PageResponse, StatementResp } from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { Fragment, useEffect, useState } from "react"

export default function Page() {
  const [initData, setInitData] = useState<PageResponse<StatementResp> | null>()
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM"))
  const t = useTranslations("Profile.income")
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

  const StatementTypeList: ChangeTypeDesc[] = [
    { type: ChangeType.RECHARGE, desc: t("recharge") },
    { type: ChangeType.BUY_VIP, desc: t("subscribe") },
    { type: ChangeType.REWARD, desc: t("tip") },
    { type: ChangeType.PAY_POST, desc: t("postPay") },
    { type: ChangeType.WITHDRAW, desc: t("withdrawal") }
  ]
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
                defVal={date}
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
                      <span className="text-[#979799]">
                        {" "}
                        {t("balance")}:{v.balance_snapshot}
                      </span>
                      {v.from_user && (
                        <span className="text-orange">{StatementTypeList[v.change_type - 1].desc} {v.from_user}</span>
                      )}
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
