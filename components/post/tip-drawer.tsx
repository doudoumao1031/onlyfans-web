"use client"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import CheckboxLabel from "@/components/user/checkbox-label"
import { addPostTip, starPost } from "@/lib"
import FormDrawer from "@/components/common/form-drawer"
import { useCommonMessageContext } from "@/components/common/common-message"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import CommonRecharge from "@/components/post/common-recharge"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"
import { useTranslations } from "next-intl"

interface TipDrawerProps {
  postId: number
  refresh: (amount: number) => void
  tipStar: (star: boolean) => void
  notice?: boolean //是否发送通知事件
  children?: React.ReactNode
}

export default function TipDrawer(props: TipDrawerProps) {
  const t = useTranslations("Common.post")
  const { postId, refresh, tipStar, notice, children } = props
  const { addToActionQueue } = useGlobal()
  const [amount, setAmount] = useState<number>(0)
  const [check, setCheck] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [recharge, setRecharge] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const { showMessage } = useCommonMessageContext()
  const { withLoading } = useLoadingHandler({
    onError: (error) => {
      console.error("Recharge error:", error)
      showMessage(t("tipFailed"), "error")
    }
  })
  async function handTip() {
    await withLoading(async () => {
      const res = await addPostTip({ post_id: Number(postId), amount: amount })
      if (res && res.code === 0) {
        if (check) {
          const starRes = await starPost({ post_id: Number(postId), deleted: false })
          if (starRes) {
            tipStar(true)
            console.log("tip and star success")
          } else {
            console.log("tip and star failed")
          }
        }
        setDrawerOpen(false)
        showMessage(t("tipSuccess"), "success", {
          afterDuration: () => {
            refresh(amount)
          },
          duration: 1500
        })
      } else if (res?.message == "NOT_ENOUGH_BALANCE") {
        setDrawerOpen(false)
        setVisible(true)
      } else {
        throw new Error()
      }
    })
    if (notice) {
      addToActionQueue({
        type: ActionTypes.EXPLORE.REFRESH
      })
    }
  }
  type ToggleData = {
    val: number
    txt: string
  }

  const toggleList:ToggleData[] = [
    { val: 1, txt: "1 USDT" },
    { val: 2, txt: "2 USDT" },
    { val: 3, txt: "3 USDT" }
  ]

  const handleToggleValue = (value: number) => {
    if (value) {
      setAmount(value)
    } else {
      setAmount(0)
    }
  }
  return (
    <>
      <CommonRecharge
        visible={visible}
        setVisible={setVisible}
        recharge={recharge}
        setRecharge={setRecharge}
      />
      <button
        onClick={() => {
          setDrawerOpen(true)
        }}
      >
        {children}
      </button>
      <FormDrawer
        title={""}
        trigger={children}
        isAutoHeight
        headerLeft={() => {
          return <span className="font-semibold text-lg">{t("tipAmount")}</span>
        }}
        headerRight={() => {
          return (
            <>
              <CheckboxLabel
                label={t("likeAtTheSameTime")}
                checked={check}
                change={(val) => {
                  setCheck(val)
                }}
              />
            </>
          )
        }}
        className="border-0"
        setIsOpen={setDrawerOpen}
        isOpen={drawerOpen}
        outerControl={true}
      >
        <div className="flex flex-col items-center text-black text-base bg-slate-50 rounded-t-lg">
          <div className={"w-full mt-[20px] px-4 grid grid-cols-3 gap-3.5"}>
            {toggleList.map((item, i) => {
              return (
                <button
                  key={i}
                  type={"button"}
                  className={`w-full h-16 text-base font-medium rounded-xl ${
                    amount === item.val ? "bg-theme text-white" : "bg-white"
                  }`}
                  onTouchEnd={() => {
                    handleToggleValue(item.val)
                  }}
                >
                  {item.txt}
                </button>
              )
            })}
          </div>
          <div className="w-full flex items-center mt-[20px] px-4 relative">
            <input
              id="amount"
              type="number"
              className="w-full py-2 px-16 border-0 bg-white rounded-lg text-right h-[49px] placeholder:text-gray-400"
              placeholder="0.00"
              max={999}
              value={amount == 0 ? "" : amount.toString()}
              onChange={(event) => {
                const money = event.target.value.replace(/[^0-9.]/g, "")
                setAmount(parseFloat(money) || 0)
              }}
              onBlur={(event) => {
                Number(event.target.value).toFixed(2)
              }}
            />
            <Label
              htmlFor="amount"
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-left font-medium pointer-events-none pr-12"
            >
              {t("custom")}
            </Label>
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 font-normal pointer-events-none z-0">
              USDT
            </span>
          </div>

          <div className="my-[40px]  self-center">
            <button
              type={"button"}
              disabled={amount === 0 || !amount}
              className={`w-[295px] h-[49px] p-2 text-white text-base font-medium rounded-full ${
                amount === 0 || !amount ? "bg-gray-quaternary" : "bg-theme"
              }`}
              onTouchEnd={async () => {
                if (amount > 0) {
                  await handTip()
                }
              }}
            >
              {amount > 0 ? t("tipConfirm", { amount, currency: "USDT" }) : t("confirmTip")}
            </button>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}
