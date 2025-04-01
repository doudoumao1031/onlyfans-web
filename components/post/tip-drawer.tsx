"use client"
import React, { useState } from "react"

import { useTranslations } from "next-intl"

import { useCommonMessageContext } from "@/components/common/common-message"
import FormDrawer from "@/components/common/form-drawer"
import CommonRecharge from "@/components/post/common-recharge"
import { Label } from "@/components/ui/label"
import CheckboxLabel from "@/components/user/checkbox-label"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { addPostTip, starPost } from "@/lib"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"


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
          return <span className="text-lg font-semibold">{t("tipAmount")}</span>
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
        <div className="flex flex-col items-center rounded-t-lg bg-slate-50 text-base text-black">
          <div className={"mt-[20px] grid w-full grid-cols-3 gap-3.5 px-4"}>
            {toggleList.map((item, i) => {
              return (
                <button
                  key={i}
                  type={"button"}
                  className={`h-16 w-full rounded-xl text-base font-medium ${
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
          <div className="relative mt-[20px] flex w-full items-center px-4">
            <input
              id="amount"
              type="number"
              className="h-[49px] w-full rounded-lg border-0 bg-white px-16 py-2 text-right placeholder:text-gray-400"
              placeholder="0.00"
              // max={999}
              // min={0.01}
              value={amount.toString()}
              onChange={(event) => {
                const value = event.target.value
                // 允许输入数字和小数点，但小数点后最多两位
                const regex = /^\d*\.?\d{0,2}$/
                if (regex.test(value) || value === "") {
                  setAmount(parseFloat(value) || 0)
                }
              }}
              onBlur={(event) => {
                const value = event.target.value
                if (value) {
                  const formattedValue = parseFloat(value).toFixed(2)
                  setAmount(parseFloat(formattedValue))
                }
              }}
            />
            <Label
              htmlFor="amount"
              className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 pr-12 text-left font-medium"
            >
              {t("custom")}
            </Label>
            <span className="pointer-events-none absolute right-6 top-1/2 z-0 -translate-y-1/2 font-normal">
              USDT
            </span>
          </div>

          <div className="my-[40px]  self-center">
            <button
              type={"button"}
              disabled={!amount || amount < 0.1}
              className={`h-[49px] w-[295px] rounded-full p-2 text-base font-medium text-white ${
                !amount || amount < 0.1 ? "bg-gray-quaternary" : "bg-theme"
              }`}
              onTouchEnd={async () => {
                if (amount >= 0.1) {
                  await handTip()
                }
              }}
            >
              {amount >= 0.1 ? t("tipConfirm", { amount, currency: "USDT" }) : amount > 0 && amount < 0.1 ? t("minTip") : t("confirmTip")}
            </button>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}
