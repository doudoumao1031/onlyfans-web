"use client"
import IconWithImage from "@/components/profile/icon"
import React, { useCallback } from "react"
import { useRouter } from "next/navigation"

export default function Header({ handleBack, title, right, titleColor, backIconColor, leftTitle }: {
  handleBack?: () => void,
  title?: React.ReactNode,
  titleColor?: string,
  backIconColor?: string,
  right?: React.ReactNode
  leftTitle?: React.ReactNode
}) {
  const router = useRouter()
  const myBack = useCallback(() => {
    if (!document.referrer) {
      router.back()
      return
    }
    const url = new URL(document.referrer)
    if (url.pathname) {
      router.replace(url.pathname)
    } else {
      router.back()
    }
  }, [router])
  const handleClickBack = handleBack ? handleBack : myBack

  return (
    <section className="flex align-middle justify-between items-center w-screen px-4 text-black max-w-lg" style={{ aspectRatio: "375/44" }}>
      <div className="flex justify-start shrink-0 w-1/5">
        <button onTouchEnd={handleClickBack}>
          <IconWithImage url="/icons/profile/icon_nav_back@3x.png" width={22} height={22} color={`${backIconColor ?? "#000"}`} />
        </button>
        {leftTitle}
      </div>
      <div className={"text-center flex-1 text-[18px]"} style={{ color: titleColor ?? "#fff" }}>{title}</div>
      <div className="flex justify-end shrink-0 gap-5 items-center w-1/5">{right}</div>
    </section>
  )
}
