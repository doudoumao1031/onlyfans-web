"use client"
import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"
import { useState, useEffect } from "react"
import { addWalletOrder, handleRechargeOrderCallback, userPtWallet } from "@/lib"
import { useCommonMessageContext } from "@/components/common/common-message"
import { Link } from "@/i18n/routing"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import React from "react"
import { useTranslations } from "next-intl"

interface RechargeProps {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  setWfAmount: (val: number) => void
}

export default function RechargeDrawer(props: RechargeProps) {
  const { children, isOpen, setIsOpen, setWfAmount } = props
  const { showMessage } = useCommonMessageContext()
  const [amount, setAmount] = useState<number>(0)
  const [ptBalance, setPtBalance] = useState<number>(0)
  const [wfBalance, setWfBalance] = useState<number>(0)
  const [rate, setRate] = useState<string>("1:1")
  const t = useTranslations("Profile.recharge")
  const { withLoading } = useLoadingHandler({
    onError: () => {
      showMessage(t("error"))
    }
  })
  useEffect(() => {
    getSettingData()
  }, [])

  const getSettingData = async () => {
    setAmount(0)
    await userPtWallet().then((result) => {
      if (result && result.code === 0) {
        setPtBalance(Number(result.data.pt_wallet))
        setWfBalance(result.data.amount)
        setRate(result.data.proportion)
        setWfAmount(result.data.amount)
      }
    })
  }
  const columns: { title: string; desc: string }[] = [
    { title: t("service"), desc: t("fansRecharge") },
    { title: t("walletBalance"), desc: ptBalance.toFixed(2).toString() + " USDT" },
    { title: t("fansxBalance"), desc: wfBalance.toFixed(2).toString() + " USDT" },
    { title: t("rate"), desc: rate }
  ]

  async function handleRecharge(amount: number) {
    await withLoading(async () => {
      const tradeNo = await addWalletOrder({ amount: Number(amount) }).then((result) => {
        if (result && result.code === 0) {
          return result.data.trade_no
        }
        throw Error()
      })

      await handleRechargeOrderCallback({ trade_no: tradeNo }).then((result) => {
        if (result && result.code === 0) {
          showMessage(t("success"), "success")
          getSettingData()
          setAmount(0)
          setIsOpen(false)
        } else {
          showMessage(t("error"))
        }
      })
    })
  }

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {children}
      </button>
      <FormDrawer
        title={<span className={"text-[18px] font-semibold"}>{t("title")}</span>}
        headerLeft={(close) => {
          return (
            <button
              onTouchEnd={(e) => {
                e.preventDefault()
                close()
              }}
              className={"text-base text-[#777]"}
            >
              <IconWithImage
                url={"/icons/profile/icon_close@3x.png"}
                width={24}
                height={24}
                color={"#000"}
              />
            </button>
          )
        }}
        headerRight={() => {
          return (
            <Link href={"/profile/recharge"} prefetch={false}>
              <button className={"text-base text-text-theme"}>{t("details")}</button>
            </Link>
          )
        }}
        className="border-0"
        isAutoHeight
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        outerControl={true}
      >
        <div className="w-full flex flex-col items-center text-black text-2xl bg-[#F8F8F8]">
          <div className={"rounded-xl p-4 w-full text-base"}>
            {columns.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between px-4 py-[13px] items-center bg-white 
              ${index < columns.length - 1 && "border-b border-gray-200"}
              ${index == 0 && "rounded-t-xl"} 
              ${index == columns.length - 1 && "rounded-b-xl"} 
              `}
              >
                <span className={"font-medium"}>{item.title}</span>
                <span className={"text-gray-400 font-normal"}>{item.desc}</span>
              </div>
            ))}
          </div>
          <div className="w-full flex items-center px-4 relative">
            <input
              id="amount"
              type="number"
              className="w-full py-2 pl-4 pr-16 border-0 bg-white rounded-lg text-left h-[49px] placeholder:text-gray-400 text-base"
              placeholder={t("rechargeValuePlaceholder")}
              value={amount == 0 ? "" : amount.toString()}
              onChange={(event) => {
                const money = event.target.value.replace(/[^0-9.]/g, "")
                setAmount(parseFloat(money) || 0)
              }}
              onBlur={(event) => {
                const formattedAmount = parseFloat(event.target.value).toFixed(2)
                setAmount(parseFloat(formattedAmount) || 0)
              }}
            />
            {ptBalance > 0 && (
              <button
                className="absolute right-6 top-1/2 transform -translate-y-1/2 font-normal text-text-theme text-base"
                onTouchEnd={(e) => {
                  e.preventDefault()
                  setAmount(parseFloat(ptBalance.toFixed(2)) || 0)
                }}
              >
                {t("all")}
              </button>
            )}
          </div>
          <div className="my-[40px] self-center">
            <button
              type="button"
              disabled={amount === 0 || amount > ptBalance}
              className={`w-[295px] h-[49px] p-2 text-white text-base font-medium rounded-full ${
                amount === 0 || amount > ptBalance ? "bg-[#dddddd]" : "bg-background-theme"
              }`}
              onClick={async () => {
                if (!(amount === 0 || amount > ptBalance)) {
                  await handleRecharge(amount)
                }
              }}
            >
              {amount > ptBalance ? t("amountGreaterThanPtamount") : t("confirm")}
            </button>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}
