"use client"
import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"
import { useState } from "react"
export type TProps = {
  defVal: string //YYYY-MM
  trigger?: React.ReactNode
  confirm: (date: string) => void
}
const months = [
  { label: "一月", value: 1 },
  { label: "二月", value: 2 },
  { label: "三月", value: 3 },
  { label: "四月", value: 4 },
  { label: "五月", value: 5 },
  { label: "六月", value: 6 },
  { label: "七月", value: 7 },
  { label: "八月", value: 8 },
  { label: "九月", value: 9 },
  { label: "十月", value: 10 },
  { label: "十一月", value: 11 },
  { label: "十二月", value: 12 }
]
export default function DatePicker({ defVal, trigger, confirm }: TProps) {
  const [date, setDate] = useState<string>(defVal)
  const [curYear, curMonth] = date.split("-")
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [year, setYear] = useState<number>(Number(curYear))
  const [month, setMonth] = useState<number>(Number(curMonth))

  return (
    <div>
      {!trigger && (
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
              {curYear}年{curMonth}月
            </span>
            <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#bbb"} />
          </span>
        </div>
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
            <span className="mr-3 flex-1">{year}年</span>
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
        trigger={trigger || null}
        outerControl={trigger ? false : true}
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
                confirm(year + "-" + month)
              }}
              className="w-[78%] h-[50px] bg-pink text-white rounded-full flex justify-center items-center"
            >
              确定
            </div>
          </div>
        </div>
      </FormDrawer>
    </div>
  )
}
