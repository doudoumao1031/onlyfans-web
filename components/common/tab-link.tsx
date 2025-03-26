"use client"

import { useCallback } from "react"

import clsx from "clsx"

import { usePathname } from "next/navigation"


import { Link } from "@/i18n/routing"

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
    <div className="grid w-full grid-cols-2 border-b border-gray-100 text-center">
      {links.map((link) => (
        <Link
          replace={true}
          prefetch={true}
          key={link.name}
          href={link.href}
          className={clsx("relative py-3.5 text-xl", pathNameClass(link.href))}
        >
          {`${link.name}`}
          <span className={clsx("bg-theme absolute bottom-0 left-[50%] ml-[-20px] h-[3px] w-[40px] rounded-t-lg", pathName.endsWith(link.href) ? "block" : "hidden")}></span>
        </Link>
      ))}
    </div>
  )
}