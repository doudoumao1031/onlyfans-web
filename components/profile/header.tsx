"use client";
import React from "react";
import IconWithImage from "./icon";
import {useRouter} from "next/navigation"

export default function Header({right, title}: { right?: React.ReactNode, title: React.ReactNode }) {
    const router = useRouter()
    return <section className="flex align-middle justify-between items-center h-[44px] pl-4 pr-4">
        <div className="flex justify-start shrink-0 w-[30%]">
            <button onClick={router.back}>
                <IconWithImage url="/icons/profile/icon_nav_back@3x.png" width={22} height={22} color={'#222'}/>
            </button>
        </div>
        <div className="text-center flex-1 text-[18px] font-medium">{title}</div>
        <div className="flex justify-end shrink-0 w-[30%] gap-5 items-center">{right}</div>
    </section>
}