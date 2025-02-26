"use client"
import { Link } from "@/i18n/routing"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { useEffect, useMemo, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"

export default function NavLinks({ isFind }: { isFind?: boolean }) {
  const locale = useLocale()
  const t = useTranslations("Explore")
  const pathName = usePathname()
  const activeLinkRef = useRef<HTMLAnchorElement>(null)
  const links = useMemo(
    () => [
      { name: t("Subscribed"), href: `/${locale}/explore/subscribed` },
      { name: t("Followed"), href: `/${locale}/explore/followed` },
      { name: isFind ? t("hot") : t("Feed"), href: `/${locale}/explore/feed` },
      { name: t("Recommended"), href: `/${locale}/explore/recommended/hot` }
    ],
    [isFind, locale, t]
  )
  const memoLink = useMemo(() => {
    return (isFind ? links.slice(1) : links).map((link) => {
      return {
        ...link,
        active:
          pathName === link.href ||
          (link.href.startsWith(`/${locale}/explore/recommended`) &&
            pathName.startsWith(`/${locale}/explore/recommended`))
      }
    })
  }, [pathName, isFind, links, locale])
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [memoLink])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathName === href) {
      e.preventDefault()
      window.dispatchEvent(new Event("feed-action-scroll-top"))
    }
  }

  return (
    <div
      className={`w-full flex text-center border-b border-gray-100 sticky z-30 bg-white overflow-x-auto gap-3 ${
        isFind ? "justify-start" : "justify-around"
      }`}
    >
      {memoLink.map((link) => (
        <Link
          prefetch={true}
          key={link.name}
          href={link.href}
          ref={link.active ? activeLinkRef : null}
          onClick={(e) => handleNavClick(e, link.href)}
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
