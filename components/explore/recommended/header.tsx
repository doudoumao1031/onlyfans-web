"use client"
import { useEffect, useRef } from "react"

import { useTranslations } from "next-intl"

import { usePathname } from "next/navigation"


import { Link } from "@/i18n/routing"

export default function Header() {
  const pathname = usePathname()
  const t = useTranslations("Explore.recommended")
  const tabs = [
    { path: "/explore/recommended/hot", label: t("hot") },
    { path: "/explore/recommended/new", label: t("new") },
    { path: "/explore/recommended/popular", label: t("popular") }
  ]

  const activeTabRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [pathname])

  return (
    <div className="hide-scrollbar mb-2 flex w-full gap-5 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          ref={pathname.endsWith(tab.path) ? activeTabRef : null}
          className={`flex shrink-0 items-center justify-center whitespace-nowrap text-[15px] ${pathname.endsWith(tab.path)
              ? "font-medium"
              : "font-normal"
            }`}
        >
          <span className="text-nowrap">{tab.label}</span>
        </Link>
      ))}
    </div>
  )
}
