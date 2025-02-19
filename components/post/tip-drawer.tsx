"use client"
import { Label } from "@/components/ui/label"
import React,{ useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import CheckboxLabel from "@/components/user/checkbox-label"
import { addPostTip, starPost } from "@/lib"
import Modal from "@/components/space/modal"
import FormDrawer from "@/components/common/form-drawer"
import  { useCommonMessageContext } from "@/components/common/common-message"
interface TipDrawerProps {
  postId: number;
  refresh: (amount: number) => void;
  children?: React.ReactNode,
}
const TipDrawer: React.FC<TipDrawerProps> = ({ children, postId, refresh }) => {
  const [amount, setAmount] = useState<number>(0)
  const [check, setCheck] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const { showMessage } = useCommonMessageContext()
  const { isLoading, withLoading } = useLoadingHandler({
    onError: (error) => {
      console.error("Recharge error:", error)
      showMessage("打赏失败")
    }
  })
  async function handTip() {
    await withLoading(async () => {
      addPostTip({ post_id: Number(postId), amount: amount })
        .then(async (res) => {
          if (res && res.code === 0) {
            console.log("tip success")
            if (check) {
              await starPost({ post_id: Number(postId), deleted: false })
              console.log("star success")
            }
            setDrawerOpen(false)
            showMessage("打赏成功", "success", { afterDuration: () => {refresh(amount) }, duration: 1500 })
          } else if (res?.message == "NOT_ENOUGH_BALANCE") {
            setDrawerOpen(false)
            setVisible(true)
          } else {
            console.log("tip failed")
          }
        })
    })
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
      <Modal
        visible={visible}
        cancel={() => {
          setVisible(false)
        }}
        type={"modal"}
        content={<div className="p-4 pb-6">余额不足</div>}
        okText="充值"
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
          return <span className="font-semibold text-lg">打赏金额</span>
        }}
        headerRight={() => {
          return (
            <>
              <CheckboxLabel
                label="同时点赞"
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
              自定义
            </Label>
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-lg font-normal pointer-events-none z-0">
              USDT
            </span>
          </div>

          <div className="my-[40px]  self-center">
            <button
              disabled={amount == 0}
              className="w-[295px] h-[49px] p-2 bg-background-pink text-white text-base font-medium rounded-full"
              onTouchEnd={(event) => {
                event.preventDefault()
                handTip()
              }}
            >
              确认支付{amount}USDT
            </button>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}

export default TipDrawer
