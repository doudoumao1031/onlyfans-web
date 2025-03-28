"use client"
import React, { useState, useEffect } from "react"

import { useTranslations } from "next-intl"

import { useCommonMessageContext } from "@/components/common/common-message"
import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { Link } from "@/i18n/routing"
import { addWalletOrder, IosPayArray, userPtWallet } from "@/lib"
import { ANDROID, IOS } from "@/lib/constant"



interface RechargeProps {
  children?: React.ReactNode
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  setWfAmount: (val: number) => void
}

export default function RechargeDrawer(props: RechargeProps) {
  const { children, isOpen, setIsOpen, setWfAmount } = props
  const { showMessage } = useCommonMessageContext()
  const getDeviceType = () => {
    if (typeof window === "undefined") return ANDROID
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod") || userAgent.includes("ios")) {
      return IOS
    }
    return ANDROID
  }
  const type = getDeviceType()
  console.log("type ===>", type)
  const [amount, setAmount] = useState<number>(0)
  const [ptBalance, setPtBalance] = useState<number>(0)
  const [wfBalance, setWfBalance] = useState<number>(0)
  const [iosPayArray, setIosPayArray] = useState<IosPayArray[]>([])
  const [proportion, setProportion] = useState<string>("")
  const [active, setActive] = useState<number>(0)
  const [productId, setProductId] = useState<string>("")
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
        setProportion(result.data.proportion)
        setWfAmount(result.data.amount)
        setIosPayArray(result.data.ios_pay_arr ?? [])
      }
    })
  }
  const columns: { title: string; desc: string }[] = [
    { title: t("service"), desc: t("fansRecharge") },
    { title: t("walletBalance"), desc: ptBalance.toFixed(2).toString() + " USDT" },
    { title: t("fansxBalance"), desc: wfBalance.toFixed(2).toString() + " USDT" },
    { title: t("rate"), desc: proportion }
  ]

  async function handleRecharge(amount: number) {
    await withLoading(async () => {
      const tradeNo = await addWalletOrder({ amount: Number(amount) }).then((result) => {
        if (result && result.code === 0) {
          return result.data.trade_no
        }
        console.log("addWalletOrder failed", result?.message)
        throw Error()
      })
      // 发起支付 （ios/android）
      if (type === ANDROID) {
        const param = {
          currency: "USDT-TRC20",
          amount: amount.toString(),
          tradeNo: tradeNo
        }
        console.log("recharge param ===>", param)
        window?.callAppApi("recharge", JSON.stringify(param))
      } else if (type === IOS) {
        const param = {
          productId: productId
        }
        console.log("inAppPurchases param ===>", param)
        window?.callAppApi("inAppPurchases", JSON.stringify(param))
      }
    })
  }

  return (
    <>
      {children && (
      <button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {children}
      </button>
)}
      <FormDrawer
        title={<span className={"text-lg font-semibold"}>{t("title")}</span>}
        headerLeft={(close) => {
          return (
            <button
              type={"button"}
              onTouchEnd={() => {
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
              if (type === IOS && index === 1) {
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
          {type === ANDROID && (
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
          {type === IOS && iosPayArray && (
            <div className={"grid w-full grid-cols-3 gap-x-3 gap-y-5 px-4"}>
              {iosPayArray.map((item, i) => {
                return (
                  <button
                    key={i}
                    type={"button"}
                    className={`h-[49px] w-full rounded-lg border-0 font-medium ${active === i ? "bg-theme text-white" : "bg-white"}`}
                    onTouchEnd={() => {
                      setActive(i)
                      setProductId(item.product_id)
                      setAmount(Number(item.price))
                    }}
                  >
                    <span>{item.price} USDT</span>
                  </button>
                )
              })}
            </div>
          )}

          <div className="my-[40px] self-center">
            <button
              type="button"
              disabled={amount === 0 || (amount > ptBalance && type === ANDROID)}
              className={`h-[49px] w-[295px] rounded-full p-2 text-base font-medium text-white ${amount === 0 || (amount > ptBalance && type === ANDROID) ? "bg-[#dddddd]" : "bg-theme"
                }`}
              onClick={async () => {
                if (!(amount === 0 || (amount > ptBalance && type === ANDROID))) {
                  await handleRecharge(amount)
                }
              }}
            >
              {amount > ptBalance && type === ANDROID ? t("amountGreaterThanPtamount") : t("confirm")}
            </button>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}
