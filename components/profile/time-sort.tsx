"use client"
import React from "react"

import IconWithImage from "@/components/profile/icon"


export default function TimeSort({ handleSortChange, sortDesc, children }: {
    handleSortChange?: (val: boolean) => void,
    sortDesc: boolean,
    children: React.ReactNode
}) {
  return (
    <button className="flex shrink-0 items-center gap-1.5" onTouchEnd={() => {
      handleSortChange?.(!sortDesc)
    }}
    >
      <span className="text-text-theme text-xs">{children}</span>
      <div className="flex items-center justify-center">
        <IconWithImage
          url={`/icons/profile/${sortDesc ? "icon_gradedown" : "icon_gradeup"}@3x.png`} color={"#000"}
          width={20} height={20}
        />
      </div>
    </button>
  )
}