"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { useMemo } from "react"

export default function NavLinks({ isFind }: { isFind?: boolean }) {
  const links = [
    { name: "已订阅", href: "/explore/subscribed" },
    { name: "关注", href: "/explore/followed" },
    { name: isFind ? "热门" : "精彩贴文", href: "/explore/feed" },
    { name: "推荐博主", href: "/explore/recommended/hot" }
  ]
  const pathName = usePathname()
  const memoLink = useMemo(() => {
    return (isFind ? links.slice(1) : links).map((link) => {
      return {
        ...link,
        active:
          pathName === link.href ||
          (link.href.startsWith("/explore/recommended") &&
            pathName.startsWith("/explore/recommended"))
      }
    })
  }, [pathName])
  return (
    <div
      className={`w-full flex  text-center border-b border-gray-100 sticky z-30 bg-white ${
        isFind ? "justify-start" : "justify-around"
      }`}
    >
      {memoLink.map((link) => (
        <Link
          prefetch={true}
          key={link.name}
          href={link.href}
          className={clsx(
            "pt-3.5 pb-3.5 text-[20px] relative",
            link.active ? "font-bold text-black" : "text-[#777] font-normal",
            isFind ? "mr-8" : ""
          )}
        >
          {link.name}
          <span
            className={clsx(
              "absolute left-[50%] bottom-0 h-[3px] rounded-tl-lg rounded-tr-lg bg-black w-[40px] ml-[-20px]",
              link.active ? "block" : "hidden"
            )}
          ></span>
        </Link>
      ))}
    </div>
  )
}
