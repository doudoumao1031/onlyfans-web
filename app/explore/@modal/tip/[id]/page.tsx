"use client"
import { SlideUpModal } from "@/components/common/slide-up-modal"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useParams } from "next/navigation"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import CheckboxLabel from "@/components/user/checkbox-label"
import { addPostTip } from "@/lib"

export default function Page() {
  const params = useParams()
  const id = params.id // Access the dynamic route parameter
  const [amount, setAmount] = useState<number>(0)
  const handTip = () => {
    addPostTip({ post_id: Number(id), amount: amount })
      .then((res) => {
        if (res && res.code === 0) {
          console.log("tip success")
        } else {
          console.log("tip failed")
        }
      })
  }
  return (
    <>
      <SlideUpModal closeBtn={false}>
        <form action="">
          <input hidden={true} name="id" defaultValue={id}/>
          <div className="h-[35vh] flex flex-col items-center text-black text-2xl bg-slate-50">
            <div className="w-full flex justify-between px-4 py-2 bg-white">
              <div className="font-semibold text-lg">
                打赏金额
              </div>
              <CheckboxLabel label="同时点赞" checked={true}/>
            </div>
            <ToggleGroup type="single"
              variant="default"
              defaultValue="1"
              id="select_amount"
              className="w-full flex justify-around mt-[20px]"
              onValueChange={(value) => {
                if (value) {
                  setAmount(Number(value))
                } else {
                  setAmount(0)
                }
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
              <input id="amount"
                type="number"
                className="w-full py-2 px-16 border-0 bg-white rounded-lg text-right h-[49px] placeholder:text-gray-400"
                placeholder="0.00"
                max={999}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
              <Label htmlFor="amount"
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-left font-medium text-lg pointer-events-none pr-12"
              >
                自定义
              </Label>
              <span
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-lg font-normal pointer-events-none z-0"
              >
                USDT
              </span>
            </div>

            <div className="my-[40px]  self-center">
              <button
                className="w-[295px] h-[49px] p-2 bg-main-pink text-white text-base font-medium rounded-full"
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handTip()
                }}
              >确认支付{amount}USDT
              </button>
            </div>
          </div>
        </form>
      </SlideUpModal>
    </>
  )
}