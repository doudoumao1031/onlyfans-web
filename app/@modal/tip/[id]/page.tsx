"use client"
import { SlideUpModal } from "@/components/common/slide-up-modal"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useParams } from "next/navigation"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import CheckboxLabel from "@/components/user/checkbox-label"
import { addPostTip, starPost } from "@/lib"
export default function Page() {
  const params = useParams()
  const id = params.id // Access the dynamic route parameter
  const [amount, setAmount] = useState<number>(0)
  const [check, setCheck] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handTip = () => {
    if (amount && amount > 0) {
      addPostTip({ post_id: Number(id), amount: amount })
        .then(async (res) => {
          if (res && res.code === 0) {
            console.log("tip success")
            if (check) {
              await starPost({ post_id: Number(id), deleted: false })
              console.log("star success")
            }
          } else {
            console.log("tip failed")
          }
        })
    } else {
      setError("最小0.01")
      console.log("tip failed")
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
      <SlideUpModal closeBtn={false}>
        <form>
          <input hidden={true} name="id" defaultValue={id}/>
          <div className="h-[35vh] flex flex-col items-center text-black text-2xl bg-slate-50 rounded-t-lg">
            <div className="w-full flex justify-between px-4 py-2 bg-white rounded-t-lg">
              <div className="font-semibold text-lg">
                打赏金额
              </div>
              <CheckboxLabel label="同时点赞" checked={check} change={(val) => {
                setCheck(val)
              }}
              />
            </div>
            <ToggleGroup type="single"
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
              <input id="amount"
                type="number"
                className="w-full py-2 px-16 border-0 bg-white rounded-lg text-right h-[49px] placeholder:text-gray-400"
                placeholder="0.00"
                max={999}
                value={amount == 0 ? "" : amount.toString()}
                onChange={(event) => {
                  const money =event.target.value.replace(/[^0-9.]/g, "")
                  setAmount(parseFloat(money) || 0)
                }}
                onBlur={(event) => {
                  Number(event.target.value).toFixed(2)
                }}
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
                className="w-[295px] h-[49px] p-2 bg-background-pink text-white text-base font-medium rounded-full"
                onTouchEnd={(event) => {
                  event.preventDefault()
                  handTip()
                }
                }
              >确认支付{amount}USDT
              </button>
            </div>

            <section className={`${error ? "block" : "hidden"}`}>
              <div className="text-pink text-sm">
                {error}
              </div>
            </section>
          </div>
        </form>
      </SlideUpModal>
    </>
  )
}