"use client"
import React from "react"

import { useRouter } from "next/navigation"

import IconWithImage from "./icon"

export default function Header({
  right, title, backColor = "#222",backPath
}: {
  right?: React.ReactNode,
  title: React.ReactNode ,
  backColor?: string,
  backPath?: string
}) {
  const router = useRouter()
  const handleBack = () => {
    if (backPath) {
      router.push(backPath)
      return
    }
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
  }
  return (
    <section className="flex h-[44px] items-center justify-between px-4 align-middle">
      <div className="flex w-[30%] shrink-0 justify-start">
        <button onClick={handleBack} type={"button"}>
          <IconWithImage url="/icons/profile/icon_nav_back@3x.png" width={22} height={22} color={backColor}/>
        </button>
      </div>
      <div className="flex-1 text-center text-[18px] font-medium">{title}</div>
      <div className="flex w-[30%] shrink-0 items-center justify-end gap-5">{right}</div>
    </section>
  )
}