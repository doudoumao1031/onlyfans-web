"use client"
import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"
import { addPostPayOrder } from "@/lib"
import { useCommonMessageContext } from "@/components/common/common-message"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { useTranslations } from "next-intl"
interface PostPayDrawerProps {
  post_id: number
  amount: number
  flush: () => void
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  setRechargeModel: (val: boolean) => void
}
export default function PostPayDrawer(props: PostPayDrawerProps) {
  const t = useTranslations("PostInfo")
  const { post_id, amount, flush, isOpen, setIsOpen, setRechargeModel } = props
  const { showMessage } = useCommonMessageContext()
  const { withLoading } = useLoadingHandler({
    onError: (error) => {
      console.error("post pay error:", error)
      showMessage(t("payFailed"))
    }
  })

  async function handleSubmit() {
    await withLoading(async () => {
      await addPostPayOrder({ post_id: post_id, amount: amount }).then((result) => {
        if (result && result.code === 0) {
          console.log("支付成功")
          flush()
          setIsOpen(false)
          showMessage(t("paySuccess"), "success", { afterDuration: () => flush() })
        } else if (result?.message === "NOT_ENOUGH_BALANCE") {
          setIsOpen(false)
          setRechargeModel(true)
        } else {
          setIsOpen(false)
          console.log("支付失败:", result?.message)
          showMessage(t("payFailed"))
        }
      })
    })
  }
  return (
    <>
      <FormDrawer
        title={
          <div>
            <span className="text-lg font-semibold">{t("payTitle")}</span>
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
        isAutoHeight
        className="border-0"
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        outerControl
      >
        <div className="w-full flex flex-col items-center text-black text-base bg-slate-50">
          <div className={"w-full px-4 mt-[20px]"}>
            <div
              className={"h-[49px] bg-white flex justify-between items-center py-2 px-4 rounded-xl"}
            >
              <span>$ &nbsp; {amount}</span>
              <span className={"text-gray-500"}>USDT</span>
            </div>
          </div>
          <div className="my-[40px] self-center">
            <div className="relative">
              <button
                disabled={amount === 0}
                className="w-[295px] h-[49px] p-2 bg-background-theme text-white text-base font-medium rounded-full"
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleSubmit()
                }}
              >
                {t("confirmPay", { amount, currency: "USDT" })}
              </button>
            </div>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}
