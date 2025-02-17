"use client"
import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"
import { addPostPayOrder } from "@/lib"
import useCommonMessage from "@/components/common/common-message"
interface PostPayDrawerProps {
  post_id: number
  amount: number
  flush: () => void
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  setRechargeModel: (val: boolean) => void
}
export default function PostPayDrawer (props: PostPayDrawerProps)  {
  const { post_id, amount, flush, isOpen, setIsOpen, setRechargeModel } = props
  const { showMessage, renderNode } = useCommonMessage()

  const handleSubmit = async () => {
    await addPostPayOrder({ post_id: post_id, amount:amount })
      .then((result) => {
        if (result && result.code === 0) {
          console.log("支付成功")
          flush()
          setIsOpen(false)
          showMessage("支付成功", "success")
        } else if (result?.message === "NOT_ENOUGH_BALANCE") {
          setIsOpen(false)
          setRechargeModel(true)
        } else {
          setIsOpen(false)
          console.log("支付失败:", result?.message)
          showMessage("支付失败")
        }
      })
  }
  return (
    <>
      {renderNode}
      <FormDrawer
        title={(
          <div>
            <span className="text-lg font-semibold">付费浏览此视频</span>
          </div>
        )}
        headerLeft={(close) => {
          return (
            <button onTouchEnd={(e) => {
              e.preventDefault()
              close()
            }} className={"text-base text-[#777]"}
            >
              <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={"#000"} />
            </button>
          )
        }}
        className="h-[30vh] border-0"
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        outerControl
      >
        <div className="h-[20vh] w-full flex flex-col items-center text-black text-base bg-slate-50">
          <div className={"w-full px-4 mt-[20px]"}>
            <div className={"h-[49px] bg-white flex justify-between items-center py-2 px-4 rounded-xl"}>
              <span>$ &nbsp; {amount}</span>
              <span className={"text-gray-500"}>USDT</span>
            </div>
          </div>
          <div className="my-[40px] self-center">
            <div className="relative">
              <button
                disabled={amount === 0}
                className="w-[295px] h-[49px] p-2 bg-background-pink text-white text-base font-medium rounded-full"
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleSubmit()
                }}
              >确认支付 {amount} USDT
              </button>
            </div>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}