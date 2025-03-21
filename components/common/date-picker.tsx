"use client"
import { useMemo, useState } from "react"

import { useTranslations } from "next-intl"

import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"

interface DatePickerProps {
  defVal: string //YYYY-MM
  trigger?: React.ReactNode
  confirm: (date: string) => void
}

export default function DatePicker(props: DatePickerProps) {
  const t = useTranslations("Common")
  const pikerT = useTranslations("Common.datePicker")
  const months = useMemo(
    () => [
      { label: pikerT("january"), value: 1 },
      { label: pikerT("february"), value: 2 },
      { label: pikerT("march"), value: 3 },
      { label: pikerT("april"), value: 4 },
      { label: pikerT("may"), value: 5 },
      { label: pikerT("june"), value: 6 },
      { label: pikerT("july"), value: 7 },
      { label: pikerT("august"), value: 8 },
      { label: pikerT("september"), value: 9 },
      { label: pikerT("october"), value: 10 },
      { label: pikerT("november"), value: 11 },
      { label: pikerT("december"), value: 12 }
    ],
    [pikerT]
  )
  const { defVal, trigger, confirm } = props
  const [date, setDate] = useState<string>(defVal)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [curYear, curMonth] = date.split("-")
  return (
    <div>
      {!trigger && (
        <div
          className="flex bg-[#F8F8F8] px-4 py-3  "
          onClick={() => {
            setDrawerOpen(true)

            setYear(Number(curYear))
            setMonth(Number(curMonth))
          }}
        >
          <span className="flex items-center text-[#222]">
            <span className="mr-3">
              {curYear}
              {pikerT("year")}
              {curMonth}
              {pikerT("month")}
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
          <div className="flex w-full justify-between text-[#222]">
            <span className="mr-3 flex-1">
              {year}
              {pikerT("Year1")}
            </span>
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
        outerControl={!trigger}
      >
        <div className="bg-[#F8F8F8]  pb-10">
          <div className="flex w-full flex-wrap justify-between p-6 pt-2">
            {months.map((v) => (
              <div
                key={v.value}
                onClick={() => {
                  setMonth(v.value)
                }}
                className={`mt-4 flex h-[50px] w-[22%] items-center justify-center rounded-lg  ${
                  month === v.value ? "bg-theme text-white" : "bg-white"
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
              className="bg-theme flex h-[50px] w-[78%] items-center justify-center rounded-full text-white"
            >
              {t("confirm")}
            </div>
          </div>
        </div>
      </FormDrawer>
    </div>
  )
}
