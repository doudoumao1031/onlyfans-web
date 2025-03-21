"use client"
import RechargeDrawer from "@/components/profile/recharge-drawer"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import SheetSelect from "../common/sheet-select"
// import WithdrawDrawer from "./withdraw-drawer"
import { WalletInfo } from "@/lib"
import { useRouter } from "@/i18n/routing"

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
              <div className={"rounded-full border border-white text-center px-[18px] p-[6px] text-white"}>{t("actions.wallet")}
              </div>
            </SheetSelect>
          </div>
        </div>
      </div>
      <RechargeDrawer isOpen={isOpen} setIsOpen={setIsOpen} setWfAmount={setInitAmount}><></></RechargeDrawer>
      {/* <WithdrawDrawer isOpen={withdrawOpen} setIsOpen={setWithdrawOpen} info={walletInfo}><></></WithdrawDrawer> */}
    </>
  )
}