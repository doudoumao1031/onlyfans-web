"use client"
import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import Empty from "@/components/common/empty"
import { StatementResp, userStatement } from "@/lib"
import dayjs from "dayjs"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

function WithdrawalInfoContent() {
  const t = useTranslations("Profile")
  const searchParams = useSearchParams()
  const changeType = Number(searchParams.get("changeType"))
  const [list, setList] = useState<StatementResp[]>()

  useEffect(() => {
    const statementList = async () => {
      try {
        const list = await userStatement({
          change_type: changeType,
          pageSize: 20,
          page: 1,
          from_id: 0
        }).then((res) => {
          if (res && res.code === 0) {
            return res.data.list
          }
        })
        setList(list)
      } catch (error) {
        console.error("Error fetching statement:", error)
      }
    }
    statementList()
  }, [changeType])

  if (!list || list.length === 0) {
    return <Empty />
  }

  return (
    <div>
      <div className="flex p-4">
        <span className="flex items-center text-[#222]">
          <span className="mr-3">2020年1月</span>{" "}
          <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#bbb"} />
        </span>
      </div>
      <div className="p-4 pt-0">
        {list.map((v, i) => {
          const types = [
            { color: "text-[#0DC28A]", value: t("withdrawalInfo.success") },
            { color: "text-[#FFA94B]", value: t("withdrawalInfo.reviewing") },
            { color: "text-[#BBBBBB]", value: t("withdrawalInfo.failed") }
          ]
          return (
            <div key={i} className="mb-4">
              <div className="flex justify-between">
                <span>{dayjs(v.trade_time * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
                <span className="text-xs text-[#323232]">{v.change_amount} USDT</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#979799]">{t("withdrawalInfo.balance")}：{v.balance_snapshot}</span>
                <span className={`${types[v.trade_status].color}`}>
                  {types[v.trade_status].value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Page() {
  const t = useTranslations("Profile")
  return (
    <div>
      <Header title={t("withdrawalInfo.title")} titleColor="#000" />
      <Suspense fallback={<div className="flex justify-center p-4">Loading...</div>}>
        <WithdrawalInfoContent />
      </Suspense>
    </div>
  )
}
