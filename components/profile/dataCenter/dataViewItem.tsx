"use client"
import InputWithLabel from "@/components/profile/input-with-label"
import { useEffect, useMemo, useState } from "react"
import { options } from "@/components/profile/chart-line"

import { getUserMetricDay, UserMetricDay, UserMetricDayReq } from "@/lib"
import dayjs from "dayjs"
import { Line } from "react-chartjs-2"
export type TProos = {
  tabs: Record<string, string>,
  title: string
}
const DATE_FORMAT = "YYYY-MM-DD"

export default function Page({ tabs, title }: TProos) {
  const now = dayjs()
  const dateTabs: Array<{ label: string, key: number, value: UserMetricDayReq | null }> = [
    {
      label: "昨日", key: 0, value: {
        start: now.add(-1, "day").format(DATE_FORMAT),
        end: now.add(-1, "day").format(DATE_FORMAT)
      }
    },
    {
      label: "近7日", key: 1, value: {
        start: now.add(-7, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: "近15日", key: 2, value: {
        start: now.add(-15, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: "近30日", key: 3, value: {
        start: now.add(-30, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: "近90日", key: 4, value: {
        start: now.add(-90, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    // {
    //   label: "累计", key: 5, value: null
    // }
  ]
  const [dateType, setDateType] = useState<number>(2)
  const [active, setActive] = useState<string>(Object.keys(tabs)[0])
  const [dataInfo, setDataInfo] = useState<UserMetricDay[]>()
  // const [statistics,setStatistics] = useState<Record<string, number>>({})
  useEffect(() => {
    getInfoData()
  }, [dateType])

  const getInfoData = async () => {
    const res = await getUserMetricDay(dateTabs[dateType]?.value || {})
    if (!res) return
    setDataInfo(res.list.reverse())
  }
  const lineData = useMemo(() => {
    return {
      labels: dataInfo?.map(item => item.day),
      datasets: [
        {
          label: tabs[active],
          data: dataInfo?.map(item => item[active as keyof typeof item]),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y"
        }
      ]
    }
  }, [dataInfo, active])

  const statistics = useMemo(() => {
    return Object.keys(tabs).reduce((pre, cur) => {
      if (!pre[cur]) {
        const total = dataInfo?.map(v => v[cur as keyof typeof v]).reduce((iPre, iCur) => {
          iPre = Number(iPre) + (iCur as number)
          return iPre
        }, 0)
        pre[cur] = Number(total)
      }
      return pre
    }, {} as { [key: string]: number })
  }, [dataInfo])
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex items-end">
          <h1 className="text-base font-medium">{title}</h1>
          <div className="ml-2 text-[#BBB] text-xs ">凌晨2点更新</div>
        </div>
        <InputWithLabel
          placeholder={"日期范围"}
          labelClass="border-0 pl-0 pr-0 pb-0 pt-[0px] text-[#6D7781]"
          iconSize={16}
          onInputChange={(e) => {
            setDateType(e as number)
          }}
          options={dateTabs.map(v => ({ label: v.label, value: v.key }))}
          value={dateType}
        />
      </div>
      <div className="flex justify-between m-4">
        {Object.keys(tabs).map(v => (
          <div onClick={() => { setActive(v) }} key={v} className={`w-32 h-16 flex justify-center flex-col items-center ${active === v && "border-[#FF8492] bg-[#FF8492] bg-opacity-20 border rounded-md "}`}>
            <span className="text-xl font-medium">{statistics[v] || "0"}</span>
            <span className="text-xs text-[#6D7781]">{tabs[v]}</span>
          </div>
        ))}

      </div>
      <Line options={options} data={lineData} />
    </div>
  )
}