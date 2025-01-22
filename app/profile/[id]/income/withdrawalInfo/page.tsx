"use client"
import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import Empty from "@/components/common/empty"
import { StatementResp, userStatement } from "@/lib"
import dayjs from "dayjs"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const changeType = Number(searchParams.get("changeType"))
  console.log("changeType=",changeType)
  const [list, setList] = useState<StatementResp[]>()

  useEffect(() => {
    console.log("useEffect called with changeType:", changeType)
    const statementList = async () => {
      try {
        const list = await userStatement({ change_type: changeType, pageSize: 20, page: 1, from_id: 0 })
          .then((res) => {
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
  }, [])
  console.log("data: ", list && list.length)
  return (
    <>
      <Header title="明细" titleColor="#000" />
      {list && list.length > 0 ? (
        <div>
          <div className="flex p-4">
            <span className="flex items-center text-[#222]"><span className="mr-3">2020年1月</span>   <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#bbb"} /></span>
          </div>
          <div className="p-4 pt-0">
            {
              list.map((v, i) => {
                const types = [{ color: "text-[#0DC28A]", value: "成功" }, { color: "text-[#FFA94B]", value: "审核中" }, { color: "text-[#BBBBBB]", value: "失败" }]
                return (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between">
                      <span >{dayjs(v.trade_time * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
                      <span className="text-xs text-[#323232]">{v.change_amount} USDT</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-[#979799]">余额：{v.balance_snapshot}</span>
                      <span className={`${types[v.trade_status].color}`}>{types[v.trade_status].value}</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      ) : <Empty />}

    </>
  )
}