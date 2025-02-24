"use client"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export default function Header() {
  const pathname = usePathname()
  const currentLocale = useLocale()
  const t = useTranslations("Explore.recommended")
  const tabs = [
    { path: `/${currentLocale}/explore/recommended/hot`, label: t("hot") },
    { path: `/${currentLocale}/explore/recommended/new`, label: t("new") },
    { path: `/${currentLocale}/explore/recommended/popular`, label: t("popular") }
  ]

  const activeTabRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [pathname])

  return (
    <div className="flex gap-3 w-full mb-4 justify-around overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          ref={pathname === tab.path ? activeTabRef : null}
          className={`flex flex-shrink-0 whitespace-nowrap items-center justify-center ${
            pathname === tab.path ? "bg-background-pink text-white" : "bg-white text-text-pink"
          } border border-border-pink rounded-full px-5 py-1`}
        >
          <span className="text-nowrap font-medium text-base">{tab.label}</span>
        </Link>
      ))}
    </div>
  )
}
