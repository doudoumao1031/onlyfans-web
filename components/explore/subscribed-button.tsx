"use client"
import { addSubOrder } from "@/lib"
import useCommonMessage from "@/components/common/common-message"
import { useState } from "react"
import SubscribedDrawer from "@/components/explore/subscribed-drawer"

export default function SubscribedButton({ userId, name, subPrice, type } : {userId: number, name: string, subPrice: number, type: string | "button" | "panel"}) {
  const { showMessage, renderNode } = useCommonMessage()
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const handleSubmit = async () => {
    if (subPrice === 0) {
      addSubOrder({ user_id: userId, price: 0, id: 0 })
        .then((result) => {
          if (result && result.code === 0) {
            console.log("订阅成功")
            showMessage("订阅成功", "success")
          } else {
            console.log("订阅失败:", result?.message)
            showMessage("订阅失败")
          }
        })
    } else {
      setOpenDrawer(true)
    }
  }
  return (
    <>
      {renderNode}
      {type === "button" && (
        <button className="bg-black bg-opacity-40 self-start px-2 py-1 rounded-full text-white"
          onClick={handleSubmit}
        >
          <span className="text-xs text-nowrap">免费/订阅</span>
        </button>
      )}
      {
        type === "panel" && (
          <div
            onClick={handleSubmit}
            className="w-full h-12 bg-[#ff8492] rounded-lg  pl-4 mt-2 flex flex-col justify-center text-white bg-[url('/icons/space/bg_space_subscription.png')] bg-cover"
          >
            <div>订阅</div>
            <div className="text-xs">免费</div>
          </div>
        )
      }
      {
        subPrice !== 0 && openDrawer && (
          <SubscribedDrawer userId={userId} name={name} isOpen={openDrawer}/>
        )
      }
    </>
  )
}