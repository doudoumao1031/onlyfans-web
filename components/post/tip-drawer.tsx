"use client"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
      }
    })
    if (notice) {
      addToActionQueue({
        type: ActionTypes.EXPLORE.REFRESH
      })
    }
  }

  const handleToggleValue = (value: string) => {
    if (value) {
      setAmount(Number(value))
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
        onTouchEnd={() => {
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
        <div className="flex flex-col items-center text-black text-2xl bg-slate-50 rounded-t-lg">
          <ToggleGroup
            type="single"
            variant="default"
            defaultValue="0"
            id="select_amount"
            className="w-full flex justify-around mt-[20px]"
            onValueChange={(value) => {
              handleToggleValue(value)
            }}
          >
            <ToggleGroupItem value="1">
              <span className="text-nowrap">1 USDT</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="2">
              <span className="text-nowrap">2 USDT</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="3">
              <span className="text-nowrap">3 USDT</span>
            </ToggleGroupItem>
          </ToggleGroup>

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
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-left font-medium text-lg pointer-events-none pr-12"
            >
              {t("custom")}
            </Label>
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-lg font-normal pointer-events-none z-0">
              USDT
            </span>
          </div>

          <div className="my-[40px]  self-center">
            <button
              type={"button"}
              disabled={amount === 0 || !amount}
              className={`w-[295px] h-[49px] p-2 text-white text-base font-medium rounded-full ${
                amount === 0 || !amount ? "bg-[#dddddd]" : "bg-background-pink"
              }`}
              onTouchEnd={() => {
                if (amount > 0) {
                  handTip()
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
