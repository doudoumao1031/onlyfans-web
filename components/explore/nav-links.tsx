"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { useCallback } from "react"

export default function NavLinks() {
  const links = [
    { name: "已订阅", href: "/explore/subscribed" },
    { name: "关注", href: "/explore/followed" },
    { name: "精彩贴文", href: "/explore/feed" },
    { name: "推荐博主", href: "/explore/recommended/hot" }
  ]
  const pathName = usePathname()
  const pathNameClass = useCallback(
    (href: string) => {
      if (pathName === href) {
        return "font-bold text-black "
      }
      return "text-[#777] font-normal"
    },
    [pathName]
  )
  return (
  /*<div className="flex w-full border-b border-gray-300">
      {links.map((link) => (
        <Link
          prefetch={true}
          key={link.name}
          href={link.href}
          className={clsx(
            "flex grow items-center justify-center text-sm font-medium py-2 hover:text-blue-600",
            {
              "border-b-2 border-black text-black": pathname === link.href,
              "text-gray-400": pathname !== link.href
            }
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>*/

    <div className="w-full text-center grid grid-cols-4 border-b border-gray-100 sticky z-30 bg-white">
      {links.map((link) => (
        <Link
          prefetch={true}
          key={link.name}
          href={link.href}
          className={clsx("pt-3.5 pb-3.5 text-[20px] relative", pathNameClass(link.href))}
        >
          {link.name}
          <span
            className={clsx(
              "absolute left-[50%] bottom-0 h-[3px] rounded-tl-lg rounded-tr-lg bg-black w-[40px] ml-[-20px]",
              pathName === link.href ? "block" : "hidden"
            )}
          ></span>
        </Link>
      ))}
    </div>
  )
}
