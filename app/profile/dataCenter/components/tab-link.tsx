"use client"
import Link from "next/link"
import clsx from "clsx"
import { useCallback } from "react"
import { usePathname } from "next/navigation"
export default function TabLinks() {
  const pathName = usePathname()
  const pathNameClass = useCallback((href: string) => {
    if (pathName === href) {
      return "font-bold text-black "
    }
    return "text-[#777] font-normal"
  }, [pathName])
  const links = [
    { name: "数据概览", href: "/profile/dataCenter/dataView" },
    { name: "帖子情况", href: "/profile/dataCenter/feeds" }
  ]
  return (
    <div className="w-full text-center grid grid-cols-2 border-b border-gray-100">
      {links.map((link) => (
        <Link
          prefetch={true}
          key={link.name}
          href={link.href}
          className={clsx("pt-3.5 pb-3.5 text-[20px] relative", pathNameClass(link.href))}
        >
          {`${link.name}`}
          <span className={clsx("absolute left-[50%] bottom-0 h-[3px] rounded-tl-lg rounded-tr-lg bg-black w-[40px] ml-[-20px]", pathName === link.href ? "block" : "hidden")}></span>
        </Link>
      ))}
    </div>
  )
}