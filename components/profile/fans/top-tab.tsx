"use client"
import clsx from "clsx"
import React from "react"
import { iTabTitleOption } from "@/components/profile/tab-title"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/routing"


export default function TopTab({ tabOptions }: { tabOptions: Array<iTabTitleOption & { link: string }> }) {
  const pathname = usePathname()
  return (
    <div className="grid grid-cols-2 border-b border-gray-100 text-center">
      {tabOptions.map((item, index) => (
        <Link replace={true} href={item.link}
          className={clsx("pt-3.5 pb-3.5 text-[20px] relative", pathname.endsWith(item.link) ? "font-bold text-black" : "text-[#777] font-normal")}
          key={index}
        >
          {item.label}
          <span
            className={clsx("absolute left-[50%] bottom-0 h-[3px] rounded-tl-lg rounded-tr-lg bg-black w-[40px] ml-[-20px]", pathname.endsWith(item.link) ? "block" : "hidden")}
          ></span>
        </Link>
      ))}
    </div>
  )
}