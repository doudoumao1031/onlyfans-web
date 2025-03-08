"use client"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

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
    <div className="flex gap-3 w-full mb-4 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          ref={pathname.endsWith(tab.path) ? activeTabRef : null}
          className={`flex flex-shrink-0 whitespace-nowrap items-center justify-center ${pathname.endsWith(tab.path)
              ? "bg-background-theme text-white"
              : "bg-white text-text-theme"
            } border border-border-theme rounded-full px-5 py-1`}
        >
          <span className="text-nowrap font-medium text-base">{tab.label}</span>
        </Link>
      ))}
    </div>
  )
}
