"use client"

import { useEffect } from "react"

import { useTranslations } from "next-intl"

import IconWithImage from "@/components/profile/icon"

interface ErrorProps {
  error?: Error & { digest?: string }
  top?: number
  center?: boolean
  text?: string
  reset: () => void
}
export default function Error(props: ErrorProps) {
  const { error, top, center, text, reset } = props
  const t = useTranslations("Common")
  useEffect(() => {
    console.log(error)
  }, [error])
  return (
    <div
      className={`flex flex-col items-center ${center ? "h-screen justify-center" : ""}`}
      style={{ marginTop: center ? 0 : top ? `${top}px` : "60px" }}
    >
      <p className="mb-4 text-[15px] text-gray-secondary">{text || t("ContentLoadingFailed")}</p>
      <button
        className="bg-background-theme flex items-center rounded-full px-4 py-2 text-white hover:bg-opacity-90"
        onClick={() => {
          reset()
        }}
      >
        <IconWithImage url={"/icons/icon_refresh@3x.png"} height={16} width={16} color={"#FFF"} />
        <span className="ml-2 text-[15px]">{t("reload")}</span>
      </button>
    </div>
  )
}
