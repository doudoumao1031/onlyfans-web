"use client";
import clsx from "clsx";
import React from "react";
import Link from "next/link";
import {iTabTitleOption} from "@/components/profile/tab-title";
import {usePathname} from "next/navigation";

enum FANS_TYPE {
    SUBSCRIBE = "SUBSCRIBE",
    FOLLOW = "FOLLOW"
}

export const tabOptionsById = (id:string) => {
    return [
        {label: "订阅", name: FANS_TYPE.SUBSCRIBE, link: `/profile/${id}/fans/manage/subscribe`},
        {label: "关注", name: FANS_TYPE.FOLLOW, link: `/profile/${id}/fans/manage/follow`},
    ]
}

export default function TopTab({id}: { id: string }) {
    const pathname = usePathname()
    const options: Array<iTabTitleOption & { link: string }> = tabOptionsById(id)
    return <div className="grid grid-cols-2 border-b border-gray-100 text-center">
        {options.map((item, index) => (
            <Link href={item.link}
                  className={clsx("pt-3.5 pb-3.5 text-[20px] relative", item.link === pathname ? "font-bold text-black" : "text-[#777] font-normal")}
                  key={index}>{item.label} <span
                className={clsx("absolute left-[50%] bottom-0 h-[3px] rounded-tl-lg rounded-tr-lg bg-black w-[40px] ml-[-20px]", pathname === item.link ? "block" : "hidden")}></span></Link>))}
    </div>
}