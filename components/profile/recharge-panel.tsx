"use client"
import { useMemo, useState } from "react"

import { useTranslations } from "next-intl"

import RechargeDrawer from "@/components/profile/recharge-drawer"
import { useRouter } from "@/i18n/routing"
import { WalletInfo } from "@/lib"

import SheetSelect from "../common/sheet-select"

export default function RechargePanel({ walletInfo }: {walletInfo: WalletInfo}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  // const [withdrawOpen, setWithdrawOpen] = useState<boolean>(false)
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [initAmount, setInitAmount] = useState<number>(walletInfo.amount)
  const t = useTranslations("Profile")
  const commonT = useTranslations("Common")

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat().format(initAmount)
  },[initAmount])

  return (
    <>
      <div className={"mt-2.5 px-4"}>
        <div
          className={"flex items-center justify-between gap-1.5 rounded-xl bg-[url('/theme/bg_wallet@3x.png')] bg-cover px-[20px] pb-[20px] pt-[10px] text-white"}
        >
          <div className={"flex flex-1 flex-col overflow-hidden"}>
            <span className={"text-xs"}>{commonT("appName")}{t("balance")}</span>
            <div className={"flex items-baseline font-medium"}>
              <span className={"truncate text-[28px] "}>{formattedAmount || 0.00}</span>
              <span className={"shrink-0 text-[15px]"}>&nbsp;&nbsp;USDT</span>
            </div>
          </div>
          <div className={"shrink-0"}>
            <SheetSelect
              isOpen={openSheet}
              setIsOpen={setOpenSheet}
              onInputChange={(v) => {
                if (v === 1) {
                  setIsOpen(true)
                } else if (v === 2) {
                  setOpenSheet(false)
                  router.push("/profile/expenses")
                }
              }}
              options={[
                {
                  label: t("actions.recharge"),
                  value: 1
                },
                {
                  label: t("actions.expenseRecord"),
                  value: 2
                }
              ]}
            >
              <div className={"rounded-full border border-white p-[6px] px-[18px] text-center text-white"}>{t("actions.wallet")}
              </div>
            </SheetSelect>
          </div>
        </div>
      </div>
      <RechargeDrawer isOpen={isOpen} setIsOpen={setIsOpen} setWfAmount={setInitAmount} />
      {/* <WithdrawDrawer isOpen={withdrawOpen} setIsOpen={setWithdrawOpen} info={walletInfo}><></></WithdrawDrawer> */}
    </>
  )
}