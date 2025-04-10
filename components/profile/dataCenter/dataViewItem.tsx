"use client"
import { useEffect, useMemo, useState } from "react"


import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { Line } from "react-chartjs-2"

import { options } from "@/components/profile/chart-line"
import InputWithLabel from "@/components/profile/input-with-label"
import { getUserMetricDay, UserMetricDay, UserMetricDayReq } from "@/lib"
import { ZH_YYYY_MM_DD } from "@/lib/constant"
import { getEvenlySpacedPoints, getDateRange } from "@/lib/utils"

export type TProos = {
  tabs: Record<string, string>,
  title: string
}

export default function Page({ tabs, title }: TProos) {
  const t = useTranslations("Profile")
  const now = dayjs()
  const dateTabs: Array<{ label: string, key: number, value: UserMetricDayReq | null }> = [
    {
      label: t("dataCenter.yesterday"), key: 0, value: {
        start: now.add(-1, "day").format(ZH_YYYY_MM_DD),
        end: now.add(-1, "day").format(ZH_YYYY_MM_DD)
      }
    },
    {
      label: t("dataCenter.last7Days"), key: 1, value: {
        start: now.add(-7, "day").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
      }
    },
    {
      label: t("dataCenter.last15Days"), key: 2, value: {
        start: now.add(-15, "day").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
      }
    },
    {
      label: t("dataCenter.last30Days"), key: 3, value: {
        start: now.add(-30, "day").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
      }
    },
    {
      label: t("dataCenter.last90Days"), key: 4, value: {
        start: now.add(-90, "day").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
      }
    }
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
    const result = getEvenlySpacedPoints<UserMetricDay>((res.list || []).reverse())

    setDataInfo(result)
  }
  const lineData = useMemo(() => {
    return {
      labels: !dataInfo?.length ? getDateRange(dateTabs[dateType].value as { start: string, end: string }) : dataInfo?.map(item => item.day),
      datasets: [
        {
          label: tabs[active],
          data: dataInfo?.map(item => item[active as keyof typeof item]),
          borderColor: "#00AEF3",
          backgroundColor: "rgba(0,174,243,0.2)",
          yAxisID: "y"
        }
      ]
    }
  }, [dataInfo, tabs, active])

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
  }, [dataInfo, tabs])
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex items-end">
          <h1 className="text-base font-medium">{title}</h1>
          <div className="ml-2 text-xs text-[#BBB] ">{t("dataCenter.updateAt2AM")}</div>
        </div>
        <InputWithLabel
          placeholder={t("dataCenter.dateRange")}
          labelClass="border-0 pl-0 pr-0 pb-0 pt-[0px] text-gray-secondary"
          iconSize={16}
          onInputChange={(e) => {
            setDateType(e as number)
          }}
          options={dateTabs.map(v => ({ label: v.label, value: v.key }))}
          value={dateType}
        />
      </div>
      <div className="m-4 flex justify-between">
        {Object.keys(tabs).map(v => (
          <div onClick={() => { setActive(v) }} key={v} className={`flex h-16 w-32 flex-col items-center justify-center ${active === v && "border-theme bg-theme/20 rounded-md border "}`}>
            <span className="text-xl font-medium">{statistics[v] || "0"}</span>
            <span className="text-text-subtitle text-xs">{tabs[v]}</span>
          </div>
        ))}

      </div>
      <Line options={options} data={lineData} />
    </div>
  )
}