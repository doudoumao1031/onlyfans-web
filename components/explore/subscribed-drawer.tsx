"use client"
import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"
import {
  ToggleGroupSubscribed,
  ToggleGroupSubscribedItem
} from "@/components/ui/toggle-group-subcribed"
import { useState, useMemo, useEffect } from "react"
import { addSubOrder, DiscountInfo, viewUserSubscribeSetting } from "@/lib"
import { useCommonMessageContext } from "@/components/common/common-message"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import LoadingPage from "@/components/common/loading-page"

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
  const { showMessage  } = useCommonMessageContext()
  const [drawer, setDrawer] = useState<boolean>(false)
  const [items, setItems] = useState<DiscountInfo[]>([])
  const [discount, setDiscount] = useState<DiscountInfo>()
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    getSettingData()
  }, [])
  async function getSettingData () {
    setLoading(true)
    try {
      const settings = await viewUserSubscribeSetting({ user_id: userId })
      if (settings?.items) {
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
        list.push(...settings.items.filter((t) => !t.item_status))
        if (settings?.items) setItems(list)
      }
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
  useMemo(() => {
    if (discount && !discount.item_status) {
      if (showDiscount(discount)) {
        setAmount(discount?.discount_price ?? 0)
      } else {
        setAmount(discount?.price ?? 0)
      }
    }
  }, [discount])

  const { withLoading } = useLoadingHandler({
    onError: (error) => {
      console.error("post pay error:", error)
      showMessage("订阅失败")
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
          showMessage("订阅成功", "success", { afterDuration: () => flush?.() })
        } else if (result?.message === "NOT_ENOUGH_BALANCE") {
          setDrawer(false)
          setIsOpen?.(false)
          setRechargeModel?.(true)
        } else {
          console.log("订阅失败:", result?.message)
          showMessage("订阅失败")
        }
      })
    })
  }
  return (
    <>
      <button
        className={"w-full"}
        onClick={() => {
          if (free) {
            handleSubmit()
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
          <div>
            <span className="text-lg font-semibold">订阅</span>
            <span className="text-text-pink font-normal text-[15px] t">{name}</span>
          </div>
        }
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
        className="border-0"
        setIsOpen={setIsOpen ? setIsOpen : setDrawer}
        isOpen={isOpen ? isOpen : drawer}
        outerControl
      >
        <input hidden={true} name="user_id" defaultValue={userId} />
        <div className="flex flex-col items-center text-black text-2xl bg-slate-50">
          {loading && (
            <LoadingPage height={"h-18"} />
          )}
          {!loading && (
            <ToggleGroupSubscribed
              type="single"
              variant="default"
              id="select_pirce"
              defaultValue={discount?.id + Math.random().toString(36).substring(2, 9)}
              className="w-full mt-[20px] px-4 grid grid-cols-3 gap-x-3 gap-y-5"
              onValueChange={(value) => {
                if (value) {
                  setDiscount(items.find((item) => item.id === Number(value)) ?? items[0])
                } else {
                  setDiscount(undefined)
                }
              }}
            >
              {items.map((item) => (
                <ToggleGroupSubscribedItem key={item.id} value={String(item.id)}>
                  <div className="relative w-full col-span-3">
                    <div className="h-full flex flex-col justify-center items-center text-black">
                      <span className="text-nowrap text-xs">{item.month_count}个月</span>
                      <span
                        className={`text-nowrap text-xl my-4 ${
                          item.id === discount?.id ? "text-text-pink" : "text-black"
                        }`}
                      >
                        ${item.discount_price}
                      </span>
                      <span className="text-nowrap text-xs block">
                        {showDiscount(item) ? (
                          <s className="text-xs text-gray-500">${item.price}</s>
                        ) : (
                          <span>&nbsp;</span>
                        )}
                      </span>
                    </div>
                    {showDiscount(item) && (
                      <div className="absolute bg-orange h-4 w-16 -top-9 left-0 rounded-t-full rounded-br-full flex justify-center items-center">
                        <span className="text-white text-xs text-center">
                          {item.discount_per}% off
                        </span>
                      </div>
                    )}
                  </div>
                </ToggleGroupSubscribedItem>
              ))}
            </ToggleGroupSubscribed>
          )}
          <div className="my-[40px]  self-center">
            <div className="relative">
              <button
                type={"button"}
                disabled={amount === 0}
                className="w-[295px] h-[49px] p-2 bg-background-pink text-white text-base font-medium rounded-full"
                onTouchEnd={() => {
                  handleSubmit()
                }}
              >
                确认支付 {amount} USDT
              </button>
              {showDiscount(discount) && (
                <div className="absolute bg-orange h-4 px-2 -top-2 right-5 rounded-full flex justify-center items-center">
                  <span className="text-white text-xs text-center text-nowrap">已省 ${diff}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}
