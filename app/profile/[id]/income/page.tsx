"use client"
import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import React, { useEffect, useMemo, useState } from "react"
import { options } from "@/components/profile/chart-line"
import FormDrawer from "@/components/common/form-drawer"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Line } from "react-chartjs-2"
import { getUserMetricDay, getUserStatIncome, UserMetricDay } from "@/lib"
import dayjs from "dayjs"

const Withdrawal = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  return (
    <FormDrawer
      title={"提现"}
      headerLeft={(close) => {
        return (
          <button onTouchEnd={close} className={"text-base text-[#777]"}>
            <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={"#000"}/>
          </button>
        )
      }}
      headerRight={(() => {
        return (
          <Link href={`${pathname}/wthdrawalInfo`}>
            <button className={"text-base text-main-pink"}>明细</button>
          </Link>
        )
      })}
      trigger={children}
      className="h-[47vh] border-0"
    >
      <div className="p-8">
        <div className="flex justify-between mt-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#777] mb-2">可提现余额</span>
            <span className="text-[20px]">999.99 USDT</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#777] mb-2">审核中的余额</span>
            <span className="text-[20px]">999.99 USDT</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-10">
          <span className="font-bold text-base">提现</span>
          <span className="flex items-center">
            <Input id="price" placeholder="0.00" className="border-0 w-16 text-[#BBB]"/>
            <span>USDT</span>
          </span>
        </div>
        <div className="flex justify-center">
          <div className="w-72 h-12 rounded-full bg-main-pink text-white flex justify-center items-center mt-10">提现
          </div>
        </div>
      </div>
    </FormDrawer>
  )
}


const DATE_FORMAT = "YYYY-MM-DD"

type UserMetricDayReq = {
  start: string,
  end: string
}

function ChartData({ params }: { params: UserMetricDayReq }) {
  const [data, setData] = useState<Array<UserMetricDay>>()
  useEffect(() => {
    getUserMetricDay(params).then(response => {
      if (response) {
        setData(response.list.reverse())
      }
    })
  }, [params])

  const lineData = useMemo(() => {
    return {
      labels: data?.map(item => item.day),
      datasets: [
        {
          label: "播放量",
          data: data?.map(item => item.income),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y"
        }
      ]
    }
  }, [data])
  return <Line options={options} data={lineData}/>
}


export default function Page() {
  const now = dayjs()
  const dateTabs: Array<{ label: string, value: UserMetricDayReq }> = [
    {
      label: "近7日", value: {
        start: now.add(-7, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: "近15日", value: {
        start: now.add(-15, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: "近30日", value: {
        start: now.add(-30,"day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    }
  ]
  const [dateActive, setDateActive] = useState<UserMetricDayReq>(dateTabs[0].value)

  const tabs:Array<{ label: string, value: UserMetricDayReq }> = [
    { label: "今天", value: {
      start: now.format(DATE_FORMAT),
      end: now.format(DATE_FORMAT)
    } },
    { label: "近30日", value: {
      start: now.add(-30, "day").format(DATE_FORMAT),
      end: now.format(DATE_FORMAT)
    } },
    { label: "近一年", value: {
      start: now.add(-1, "year").format(DATE_FORMAT),
      end: now.format(DATE_FORMAT)
    } }
  ]

  const [active, setActive] = useState<UserMetricDayReq>(tabs[0].value)
  const [inCome,setIncome] = useState<number>(0)
  useEffect(() => {
    getUserStatIncome(active).then(data => {
      if (data !== null) {
        setIncome(data)
      }
    })
  },[active])

  return (
    <>
      <Header title="收益中心" titleColor="#000"/>
      <div className="flex p-4">
        {tabs.map(v => (
          <button
            type={"button"} onTouchEnd={() => {
              setActive(v.value)
            }}
            key={v.value.start}
            className={`w-20 h-8 flex justify-center items-center border border-[#FF8492] text-[#ff8492] rounded-full mr-3 ${active.start === v.value.start ? "bg-[#ff8492] text-[#fff]" : ""}`}
          >{v.label}</button>
        ))}
      </div>
      <div className="p-6 pt-0 flex justify-center items-end">
        <span className="text-[32px] font-medium">9999.99</span>
        <span className="text-[18px] text-[#777] ml-2 pb-1">USDT</span>

      </div>
      <div className="pl-4 pr-4 flex justify-between items-center mt-2 mb-12">
        <span className="text-xs">
          <span className="text-[#777] ">较前30日</span>
          <span className="text-main-pink ml-2">+{inCome}</span>
        </span>
        <Withdrawal>
          <span className="text-xs flex">
            <span className="text-[#777] ">可提现</span>
            <span className="ml-2 mr-2">+9999.99</span>
            <span>
              <IconWithImage
                url="/icons/profile/icon-r.png"
                width={14}
                color="#BBB"
                height={14}
              />
            </span>
          </span>
        </Withdrawal>

      </div>
      <div className="pl-4 font-bold text-base">收益趋势</div>
      <div className="p-4 flex">
        <span className="mr-8">收益时间</span>
        {dateTabs.map((v,index) => (
          <button type={"button"} onClick={() => {
            setDateActive(v.value)
          }} key={index} className={`mr-8 text-[#bbb] ${dateActive.start === v.value.start ? "text-main-pink" : ""}`}
          >{v.label}</button>
        ))}
      </div>
      <div className="p-4">
        <ChartData params={dateActive}/>
      </div>
    </>
  )
}