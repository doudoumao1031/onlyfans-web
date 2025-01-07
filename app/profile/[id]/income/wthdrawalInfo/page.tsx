"use client"
import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import { useState } from "react"
import Empty from "@/components/common/empty"
type TWthdrawal = {
    time: string
    num: number
    balance: number
    status: number

}
const mockData: TWthdrawal[] = [
  {
    time: "2020-01-01 16:24:32",
    num: 9999.99,
    balance: 9999.99,
    status: 1
  },
  {
    time: "2020-01-01 16:24:32",
    num: 9999.99,
    balance: 9999.99,
    status: 2
  },
  {
    time: "2020-01-01 16:24:32",
    num: 9999.99,
    balance: 9999.99,
    status: 3
  }
]

export default function Page() {
  const [list, setLIst] = useState<TWthdrawal[]>(mockData)
  return (
    <>
      <Header title="明细" titleColor="#000" />
      {list.length > 0 ? (
        <div>
          <div className="flex p-4">
            <span className="flex items-center text-[#222]"><span className="mr-3">2020年1月</span>   <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#bbb"} /></span>
          </div>
          <div className="p-4 pt-0">
            {
              list.map((v, i) => {
                const types = [{ color: "text-[#0DC28A]", value: "成功" }, { color: "text-[#BBBBBB]", value: "失败" }, { color: "text-[#FFA94B]", value: "审核中" }]
                return (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between">
                      <span >{v.time}</span>
                      <span className="text-xs text-[#323232]">{v.num} USDT</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-[#979799]">余额：{v.balance}</span>
                      <span className={`${types[v.status - 1].color}`}>{types[v.status - 1].value}</span>
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