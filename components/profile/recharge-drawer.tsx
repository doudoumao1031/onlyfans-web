"use client"
import React, { useState, useEffect } from "react"

import { useTranslations } from "next-intl"

import { useCommonMessageContext } from "@/components/common/common-message"
import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { Link } from "@/i18n/routing"
import { addWalletOrder, handleRechargeOrderCallback, userPtWallet } from "@/lib"



interface RechargeProps {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  setWfAmount: (val: number) => void
}

export default function RechargeDrawer(props: RechargeProps) {
  const { children, isOpen, setIsOpen, setWfAmount } = props
  const { showMessage } = useCommonMessageContext()
  const getDeviceType = () => {
    if (typeof window === "undefined") return "android"
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod") || userAgent.includes("ios")) {
      return "ios"
    }
    return "android"
  }
  const type = getDeviceType()
  console.log("type ===>",type)
  const [amount, setAmount] = useState<number>(0)
  const [ptBalance, setPtBalance] = useState<number>(0)
  const [wfBalance, setWfBalance] = useState<number>(0)
  const [rate, setRate] = useState<string>("1:1")
  const [active, setActive] = useState<number>(0)
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
  const iosAmounts = [{index: 0, amount: 10}, {index: 1, amount: 20}, {index: 2, amount: 50}, {index: 3, amount: 100}, {index: 4, amount: 200}, {index: 5, amount: 500}]
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
              <button className={"text-text-theme text-base"}>{t("details")}</button>
            </Link>
          )
        }}
        className="border-0"
        isAutoHeight
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        outerControl={true}
      >
        <div className="flex w-full flex-col items-center bg-[#F8F8F8] text-black">
          <div className={"w-full rounded-xl p-4 text-base"}>
            {columns.map((item, index) => {
              // ios 隐藏钱包余额
              if (type === "ios" && index === 1) {
                return null
              } else {
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between bg-white px-4 py-[13px] 
                  ${index < columns.length - 1 && "border-b border-gray-200"}
                  ${index == 0 && "rounded-t-xl"} 
                  ${index == columns.length - 1 && "rounded-b-xl"} 
                  `}
                  >
                    <span className={"font-medium"}>{item.title}</span>
                    <span className={"font-normal text-gray-400"}>{item.desc}</span>
                  </div>
                )
              }
            })}
          </div>
          {type === "android" && (
            <div className="relative flex w-full items-center px-4">
            <input
              id="amount"
              type="number"
              className="h-[49px] w-full rounded-lg border-0 bg-white py-2 pl-4 pr-16 text-left text-base placeholder:text-gray-400"
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
                type="button"
                className="text-text-theme absolute right-6 top-1/2 -translate-y-1/2 text-base font-normal"
                onTouchEnd={() => {
                  setAmount(parseFloat(ptBalance.toFixed(2)) || 0)
                }}
              >
                {t("all")}
              </button>
            )}
          </div>
          )}
          {type === "ios" && (
            <div className={"grid w-full grid-cols-3 gap-x-3 gap-y-5 px-4"}>
              {iosAmounts.map((item, i) => {
                return (
                  <button
                    key={i}
                    type={"button"}
                    className={`h-[49px] w-full border-0 rounded-lg font-medium ${active === i ? "bg-background-theme text-white" : "bg-white"}`}
                    onTouchEnd={() => {
                      setActive(i)
                      setAmount(item.amount)
                    }}
                  >
                    <span>{item.amount} USDT</span>
                  </button>
              )
              })}
            </div>
          )}
        
          <div className="my-[40px] self-center">
            <button
              type="button"
              disabled={amount === 0 || amount > ptBalance}
              className={`h-[49px] w-[295px] rounded-full p-2 text-base font-medium text-white ${
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
