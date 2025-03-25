"use client"
import { useState, useMemo, useEffect } from "react"

import { useTranslations } from "next-intl"

import { useCommonMessageContext } from "@/components/common/common-message"
import FormDrawer from "@/components/common/form-drawer"
import LoadingPage from "@/components/common/loading-page"
import IconWithImage from "@/components/profile/icon"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { DiscountInfo, viewUserSubscribeSetting } from "@/lib"
import { addSubOrder } from "@/lib/actions/orders/actions"
import { revalidateProfileData } from "@/lib/actions/revalidate/actions"


interface SubscribedDrawerProps {
  userId: number
  name: string
  free: boolean
  isOpen?: boolean
  setIsOpen?: (val: boolean) => void
  setRechargeModel?: (val: boolean) => void
  flush?: () => void //订阅成功刷新
  children?: React.ReactNode
}

export default function SubscribedDrawer(props: SubscribedDrawerProps) {
  const { userId, name, free, isOpen, setIsOpen, setRechargeModel, flush, children } = props
  const { showMessage } = useCommonMessageContext()
  const t = useTranslations("Explore")
  const [drawer, setDrawer] = useState<boolean>(false)
  const [items, setItems] = useState<DiscountInfo[]>([])
  const [active, setActive] = useState<number>(0)
  const [discount, setDiscount] = useState<DiscountInfo>()
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    getSettingData()
  }, [])
  async function getSettingData() {
    setLoading(true)
    try {
      const settings = await viewUserSubscribeSetting({ user_id: userId })
      if (settings?.price) {
        setAmount(settings?.price ?? 0)
      }
      const list: DiscountInfo[] = []
      list.push({
        id: 0,
        item_status: false,
        month_count: 1,
        price: settings?.price ?? 0,
        discount_per: 0,
        discount_price: settings?.price ?? 0,
        discount_start_time: 0,
        discount_end_time: 0,
        discount_status: true,
        user_id: userId
      })
      if (settings?.items) {
        list.push(...settings.items.filter((t) => !t.item_status))
      }
      setItems(list)
    } finally {
      setLoading(false)
    }
  }
  const showDiscount = (discount: DiscountInfo | undefined) => {
    if (!discount) return false
    const now = Date.now()
    return (
      !discount.discount_status &&
      discount.discount_start_time * 1000 <= now &&
      discount.discount_end_time * 1000 >= now
    )
  }
  const [diff, setDiff] = useState<number>(0)
  useMemo(() => {
    const diff = discount ? (discount.price - discount?.discount_price).toFixed(2) : "0"
    setDiff(parseFloat(diff))
  }, [discount])

  const { withLoading } = useLoadingHandler({
    onError: (error) => {
      console.error("post pay error:", error)
      showMessage(t("SubscribeFailed"))
    }
  })
  async function handleSubmit() {
    await withLoading(async () => {
      const data = {
        user_id: userId,
        price: free ? 0 : Number(amount),
        id: free ? 0 : discount?.id ?? 0
      }
      await addSubOrder(data).then((result) => {
        if (result && result.code === 0) {
          console.log("订阅成功")
          setIsOpen?.(false)
          setDrawer(false)
          // Revalidate profile data after successful subscription
          revalidateProfileData()
          showMessage(t("SubscribeSuccess"), "success", { afterDuration: () => flush?.() })
        } else if (result?.message === "NOT_ENOUGH_BALANCE") {
          setDrawer(false)
          setIsOpen?.(false)
          setRechargeModel?.(true)
        } else {
          console.log("订阅失败:", result?.message)
          showMessage(t("SubscribeFailed"))
        }
      })
    })
  }
  return (
    <>
      <button
        className={"w-full"}
        onClick={async () => {
          if (free) {
            await handleSubmit()
          } else {
            setDrawer(true)
          }
        }}
      >
        {children}
      </button>
      <FormDrawer
        isAutoHeight
        title={
          <div className={"flex w-[150px] flex-nowrap items-center justify-center gap-1.5"}>
            <span className="text-nowrap text-lg font-semibold">{t("Subscribe")}</span>
            <span className="text-text-theme truncate text-[15px] font-normal">{name}</span>
          </div>
        }
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
        className="border-0"
        setIsOpen={setIsOpen ? setIsOpen : setDrawer}
        isOpen={isOpen ? isOpen : drawer}
        outerControl
      >
        <input hidden={true} name="user_id" defaultValue={userId} />
        <div className="flex flex-col items-center bg-slate-50 text-2xl text-black">
          {loading ? <LoadingPage height={"h-18"} /> : (
            <div className={"mt-[20px] grid w-full grid-cols-3 gap-x-3 gap-y-5 px-4"}>
              {items.map((item,i) => {
                return (
                  <button
                    key={i}
                    type={"button"}
                    className={`relative h-[140px] w-full rounded-lg ${active === item.id ? "bg-background-secondary" : "bg-white"}`}
                    onTouchEnd={() => {
                      setActive(item.id)
                      setAmount(item.discount_price)
                      setDiscount(item)
                    }}
                  >
                    <div className="flex h-full flex-col items-center justify-center text-black">
                      <span className={`text-nowrap text-xs ${item.id === active ? "text-text-title": "text-text-desc"}`}>
                        {item.month_count} {t("Month")}
                      </span>
                      <span
                        className={`my-4 text-nowrap text-xl ${item.id === active ? "text-text-theme" : "text-text-title"}`}
                      >
                        ${item.discount_price}
                      </span>
                      <span className="block text-nowrap text-xs">
                        {showDiscount(item) ? (
                          <s className="text-text-desc text-xs">${item.price}</s>
                        ) : (
                          <span>&nbsp;</span>
                        )}
                      </span>
                    </div>
                    {showDiscount(item) && (
                      <div className="bg-orange absolute -top-1 left-0 flex h-4 w-16 items-center justify-center rounded-t-full rounded-br-full">
                        <span className="text-center text-xs text-white">
                          {item.discount_per}% off
                        </span>
                      </div>
                    )}
                  </button>
                )})}
            </div>
          )}
          <div className="my-[40px]  self-center">
            <div className="relative">
              <button
                type={"button"}
                disabled={amount === 0}
                className={`bg-background-theme h-[49px] w-[295px] rounded-full p-2 text-base font-medium text-white
                 ${amount === 0 ? "bg-[#dddddd]" : "bg-background-theme"}`}
                onTouchEnd={async () => {
                  await handleSubmit()
                }}
              >
                {t("ConfirmPayment")} {amount} USDT
              </button>
              {showDiscount(discount) && (
                <div className="bg-orange absolute -top-2 right-5 flex h-4 items-center justify-center rounded-full px-2">
                  <span className="text-nowrap text-center text-xs text-white">
                    {t("Saved")} ${diff}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}
