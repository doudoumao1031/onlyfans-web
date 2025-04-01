"use client"
import { Fragment, useEffect, useState } from "react"

import dayjs from "dayjs"
import { useTranslations } from "next-intl"

import DatePicker from "@/components/common/date-picker"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import LoadingMask from "@/components/common/loading-mask"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { ChangeType, ChangeTypeDesc, getExpenses, PageResponse, StatementResp } from "@/lib"
import { ZH_YYYY_MM, ZH_YYYY_MM_DD_HH_mm_ss } from "@/lib/constant"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"



export default function Page() {
  const [initData, setInitData] = useState<PageResponse<StatementResp> | null>()
  const [date, setDate] = useState<string>(dayjs().format(ZH_YYYY_MM))
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
    <div className="h-[calc(100vh-153px)] w-full">
      {initData && (
        <InfiniteScroll<StatementResp>
          className={"mx-auto size-full"}
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
                  <div key={i} className="border-spacing-0.5 border-b border-[#ddd] py-3">
                    <div className="flex justify-between">
                      <span>{dayjs(v.trade_time * 1000).format(ZH_YYYY_MM_DD_HH_mm_ss)}</span>
                      <span className="text-xs text-[#323232]">{v.change_amount} USDT</span>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="text-[#979799]">
                        {" "}
                        {t("balance")}:{v.balance_snapshot}
                      </span>
                      {v.from_user && (
                        <span className="text-orange max-w-[160px] truncate">{StatementTypeList[v.change_type - 1].desc} {v.from_user}</span>
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
