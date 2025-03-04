"use client"
import RechargeDrawer from "@/components/profile/recharge-drawer"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

export default function RechargePanel({ amount }: {amount: number}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [initAmount, setInitAmount] = useState<number>(amount)
  const t = useTranslations("Profile")
  const commonT = useTranslations("Common")

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat().format(initAmount)
  },[initAmount])

  return (
    <div className={"p-4"}>
      <div
        className={"bg-[url('/theme/bg_wallet@3x.png')] gap-1.5 bg-cover rounded-xl text-white flex justify-between items-center px-[20px] pt-[10px] pb-[20px]"}
      >
        <div className={"flex flex-col flex-1 overflow-hidden"}>
          <span className={"text-xs"}>{commonT("appName")}{t("balance")}</span>
          <div className={"flex items-baseline font-medium"}>
            <span className={"text-[28px] text-ellipsis whitespace-nowrap overflow-hidden "}>{formattedAmount || 0.00}</span>
            <span className={"text-[15px] shrink-0"}>&nbsp;&nbsp;USDT</span>
          </div>
        </div>
        <div className={"shrink-0"}>
          <RechargeDrawer isOpen={isOpen} setIsOpen={setIsOpen} setWfAmount={setInitAmount}>
            <div className={"rounded-full border border-white text-center px-[18px] p-[6px] text-white"}
              onTouchEnd={() => {setIsOpen(true)}}
            >{t("actions.recharge")}
            </div>
          </RechargeDrawer>
        </div>
      </div>
    </div>
  )
}