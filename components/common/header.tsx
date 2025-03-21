"use client"
import React, { useCallback } from "react"

import { useRouter } from "next/navigation"

import IconWithImage from "@/components/profile/icon"

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
    <section className="flex w-screen max-w-lg items-center justify-between px-4 align-middle text-black" style={{ aspectRatio: "375/44" }}>
      <div className="flex w-1/5 shrink-0 justify-start">
        <button onTouchEnd={handleClickBack}>
          <IconWithImage url="/icons/profile/icon_nav_back@3x.png" width={22} height={22} color={`${backIconColor ?? "#000"}`} />
        </button>
        {leftTitle}
      </div>
      <div className={"flex-1 text-center text-[18px] font-semibold"} style={{ color: titleColor ?? "#fff" }}>{title}</div>
      <div className="flex w-1/5 shrink-0 items-center justify-end gap-5">{right}</div>
    </section>
  )
}
