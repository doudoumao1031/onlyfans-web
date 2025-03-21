"use client"
import { useCallback } from "react"


import clsx from "clsx"
// import { data } from '../profile/chart-line';
import { useTranslations } from "next-intl"

import { usePathname } from "next/navigation"

import { Link } from "@/i18n/routing"
import { UserProfile } from "@/lib/actions/profile"

export default function TabLinks({ id, data }: { id: string; data: UserProfile | undefined }) {
  if (!data) {
    throw new Error()
  }
  const pathName = usePathname()
  const t = useTranslations("Space")
  const pathNameClass = useCallback(
    (href: string) => {
      if (pathName.endsWith(href)) {
        return "font-bold text-black "
      }
      return "text-[#777] font-normal"
    },
    [pathName]
  )
  const links = [
    { name: t("posts"), href: `/space/${id}/feed`, num: data.post_count },
    { name: t("media"), href: `/space/${id}/media`, num: data.media_count }
  ]
  return (
    <div className="sticky top-[68px] z-40 grid w-full grid-cols-2 border-b border-gray-100 bg-white text-center">
      {links.map((link) => (
        <Link
          replace
          prefetch={true}
          key={link.name}
          href={link.href}
          className={clsx("relative py-3.5 text-[20px]", pathNameClass(link.href))}
        >
          {`${link.name}(${link.num})`}
          <span
            className={clsx(
              "bg-theme absolute bottom-0 left-[50%] ml-[-20px] h-[3px] w-[40px] rounded-t-lg",
              pathName.endsWith(link.href) ? "block" : "hidden"
            )}
          ></span>
        </Link>
      ))}
    </div>
  )
}
