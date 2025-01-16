"use client"
import IconWithImage from "@/components/profile/icon"
import React from "react"
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
  const handleClickBack = handleBack ? handleBack : router.back
  return (
    <section className="flex align-middle justify-between items-center h-11 pl-4 pr-4 text-black">
      <div className="flex justify-start shrink-0 w-[30%]">
        <button onTouchEnd={handleClickBack}>
          <IconWithImage url="/icons/profile/icon_nav_back@3x.png" width={22} height={22} color={`${backIconColor ?? "#000"}`} />
        </button>
        {leftTitle}
      </div>
      <div className={"text-center flex-1 text-[18px]"} style={{ color: titleColor ?? "#fff" }}>{title}</div>
      <div className="flex justify-end shrink-0 w-[30%] gap-5 items-center">{right}</div>
    </section>
  )
}

