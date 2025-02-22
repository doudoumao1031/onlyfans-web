"use client"

import IconWithImage from "@/components/profile/icon"
import { useEffect } from "react"

interface ErrorProps {
  error?: Error & { digest?: string }
  top?: number
  center?: boolean
  text?: string
  reset: () => void
}
export default function Error(props: ErrorProps) {
  const { error, top, center, text, reset } = props
  useEffect(() => {
    console.log(error)
  }, [error])
  return (
    <div
      className={`flex flex-col items-center ${center ? "h-screen justify-center" : ""}`}
      style={{ marginTop: center ? 0 : top ? `${top}px` : "60px" }}
    >
      <p className="text-[#6D7781] mb-4 text-[15px]">{text || "内容加载失败"}</p>
      <button
        className="px-4 py-2 bg-background-pink text-white rounded-full hover:bg-opacity-90 flex items-center"
        onClick={() => {
          reset()
        }}
      >
        <IconWithImage url={"/icons/icon_refresh@3x.png"} height={16} width={16} color={"#FFF"} />
        <span className="ml-2 text-[15px]">重新加载</span>
      </button>
    </div>
  )
}
