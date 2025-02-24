"use client"
import RechargeDrawer from "@/components/profile/recharge-drawer"
import { useState } from "react"
import { useTranslations } from "next-intl"
export default function RechargePanel({ amount }: {amount: number}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [initAmount, setInitAmount] = useState<number>(amount)
  const t = useTranslations("Profile")
  const commonT = useTranslations("common")
  return (
    <div className={"p-4"}>
      <div
        className={"bg-[url('/icons/profile/bg_wallet.png')] bg-cover rounded-xl text-white flex justify-between items-center w-full px-[20px] pt-[10px] pb-[20px]"}
      >
        <div className={"flx flex-col justify-start"}>
          <span className={"text-xs"}>{commonT("appName")} {t("balance")}</span>
          <div className={"flex items-baseline font-medium"}>
            <span className={"text-[32px]"}>{initAmount || 0.00}</span>
            <span className={"text-[15px]"}>&nbsp;&nbsp;USDT</span>
          </div>
        </div>
        <RechargeDrawer isOpen={isOpen} setIsOpen={setIsOpen} setWfAmount={setInitAmount}>
          <div className={"rounded-full border border-white text-center px-[20px] p-[6px] text-white"}
            onTouchEnd={() => {setIsOpen(true)}}
          >{t("actions.recharge")}
          </div>
        </RechargeDrawer>
      </div>
    </div>
  )
}