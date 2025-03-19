"use client"

import { Link } from "@/i18n/routing"
import clsx from "clsx"
import { useCallback } from "react"
import { usePathname } from "next/navigation"
export interface LinkProps {
  name: string
  href: string
}
export default function TabLinks(props: { links: LinkProps[] }) {
  const { links } = props
  const pathName = usePathname()
  const pathNameClass = useCallback((href: string) => {
    if (pathName.endsWith(href)) {
      return "font-bold text-black "
    }
    return "text-[#777] font-normal"
  }, [pathName])

  return (
    <div className="w-full text-center grid grid-cols-2 border-b border-gray-100">
      {links.map((link) => (
        <Link
          replace={true}
          prefetch={true}
          key={link.name}
          href={link.href}
          className={clsx("pt-3.5 pb-3.5 text-[20px] relative", pathNameClass(link.href))}
        >
          {`${link.name}`}
          <span className={clsx("absolute left-[50%] bottom-0 h-[3px] rounded-tl-lg rounded-tr-lg bg-theme w-[40px] ml-[-20px]", pathName.endsWith(link.href) ? "block" : "hidden")}></span>
        </Link>
      ))}
    </div>
  )
}