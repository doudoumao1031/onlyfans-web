"use client";
import IconWithImage from "@/components/profile/icon";
import React from "react";


export default function TimeSort({handleSortChange, sortDesc, children}: {
    handleSortChange?: (val: boolean) => void,
    sortDesc: boolean,
    children: React.ReactNode
}) {
    return <button className="shrink-0 flex items-center gap-1.5" onTouchEnd={() => {
        handleSortChange?.(!sortDesc)
    }}>
        <span className="text-main-pink text-xs">{children}</span>
        <div className="flex items-center justify-center"><IconWithImage
            url={`/icons/profile/${sortDesc ? "icon_gradedown" : "icon_gradeup"}@3x.png`} color={'#000'}
            width={20} height={20}/></div>
    </button>
}