"use client"
import Empty from "@/components/common/empty"
import FormDrawer from "@/components/common/form-drawer"
import InfiniteScroll from "@/components/common/infinite-scroll"
import LoadingMask from "@/components/common/loading-mask"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import IconWithImage from "@/components/profile/icon"
import { getExpenses, PageResponse, StatementResp } from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { Fragment, useEffect, useState } from "react"

export default function Page() {
  const [initData, setInitData] = useState<PageResponse<StatementResp> | null>()
  const [date, setDate] = useState("2025-1")
  const [year, setYear] = useState<number>(2025)
  const [month, setMonth] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const t = useTranslations("Profile.income")
  const commonTrans = useTranslations("Common")
  const months = [
    { label: t("january"), value: 1 },
    { label: t("february"), value: 2 },
    { label: t("march"), value: 3 },
    { label: t("april"), value: 4 },
    { label: t("may"), value: 5 },
    { label: t("june"), value: 6 },
    { label: t("july"), value: 7 },
    { label: t("august"), value: 8 },
    { label: t("september"), value: 9 },
    { label: t("october"), value: 10 },
    { label: t("november"), value: 11 },
    { label: t("december"), value: 12 }
  ]

  useEffect(() => {
    setLoading(true)
    const params = {
      page: 1,
      pageSize: 20,
      from_id: 0,
      start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
      end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
    }
    getExpenses(params)
      .then((res) => {
        setInitData(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [date])
  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: getExpenses,
    params: {
      pageSize: 20,
      from_id: 0,
      start_time: Math.floor(dayjs(date).startOf("month").valueOf() / 1000),
      end_time: Math.floor(dayjs(date).endOf("month").valueOf() / 1000)
    }
  })
  const [curYear, curMonth] = date.split("-")
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
              <div
                className="flex px-4 py-3 bg-[#F8F8F8]  "
                onClick={() => {
                  setDrawerOpen(true)

                  setYear(Number(curYear))
                  setMonth(Number(curMonth))
                }}
              >
                <span className="flex items-center text-[#222]">
                  <span className="mr-3">
                    {curYear}/{curMonth}
                  </span>
                  <IconWithImage
                    url="/icons/profile/icon-bt.png"
                    width={16}
                    height={16}
                    color={"#bbb"}
                  />
                </span>
              </div>
              <div className="p-4 pt-0">
                {items.map((v, i) => (
                  <div key={i} className="py-3 border-b border-spacing-0.5 border-[#ddd]">
                    <div className="flex justify-between">
                      <span>{dayjs(v.trade_time * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
                      <span className="text-xs text-[#323232]">{v.change_amount} USDT</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-[#979799]">
                        {t("balance")}:{v.balance_snapshot}
                      </span>
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

      <FormDrawer
        isAutoHeight
        headerLeft={() => {
          return (
            <span
              onClick={() => {
                setYear(year - 1)
              }}
            >
              <IconWithImage
                url="/icons/profile/icon_nav_back@3x.png"
                width={22}
                height={22}
                color="#000"
              />
            </span>
          )
        }}
        title={
          <div className="w-full flex justify-between text-[#222]">
            <span className="mr-3 flex-1">{year}</span>
          </div>
        }
        headerRight={() => {
          return (
            <span
              onClick={() => {
                setYear(year + 1)
              }}
            >
              <IconWithImage
                url="/icons/profile/icon_nav_next@3x.png"
                width={22}
                height={22}
                color="#000"
              />
            </span>
          )
        }}
        className="border-0"
        setIsOpen={setDrawerOpen}
        isOpen={drawerOpen}
        outerControl
      >
        <div className="pb-10  bg-[#F8F8F8]">
          <div className="w-full p-6 pt-2 flex justify-between flex-wrap">
            {months.map((v) => (
              <div
                key={v.value}
                onClick={() => {
                  setMonth(v.value)
                }}
                className={`mt-4 w-[22%] h-[50px] flex justify-center items-center rounded-lg  ${
                  month === v.value ? "bg-pink text-[#fff]" : "bg-white"
                }`}
              >
                {v.label}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div
              onClick={() => {
                setDrawerOpen(false)
                setDate(year + "-" + month)
              }}
              className="w-[78%] h-[50px] bg-pink text-white rounded-full flex justify-center items-center"
            >
              {commonTrans("confirm")}
            </div>
          </div>
        </div>
      </FormDrawer>
      <LoadingMask isLoading={loading} />
    </div>
  )
}
