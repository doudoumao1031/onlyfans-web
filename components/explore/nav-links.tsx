"use client"
import { useEffect, useMemo, useRef } from "react"


import clsx from "clsx"
import { useTranslations } from "next-intl"

import { usePathname } from "next/navigation"

import { Link } from "@/i18n/routing"
import { ActionTypes } from "@/lib/contexts/global-context"

export default function NavLinks({ isFind }: { isFind?: boolean }) {
  const t = useTranslations("Explore")
  const pathName = usePathname()
  const activeLinkRef = useRef<HTMLAnchorElement>(null)
  const links = useMemo(
    () => [
      { name: t("Subscribed"), href: "/explore/subscribed" },
      { name: t("Followed"), href: "/explore/followed", event: ActionTypes.Followed.SCROLL_TO_TOP },
      {
        name: isFind ? t("hot") : t("Feed"),
        href: "/explore/feed",
        event: ActionTypes.Feed.SCROLL_TO_TOP
      },
      { name: t("Recommended"), href: "/explore/recommended/hot" }
    ],
    [isFind, t]
  )
  const memoLink = useMemo(() => {
    return (isFind ? links.slice(1) : links).map((link) => {
      return {
        ...link,
        active:
          pathName.endsWith(link.href) ||
          (link.href.includes("/explore/recommended") && pathName.includes("/explore/recommended"))
      }
    })
  }, [pathName, isFind, links])
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [memoLink])

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    event: string | undefined
  ) => {
    if (pathName.indexOf(href) > -1 && event) {
      e.preventDefault()
      window.dispatchEvent(new Event(event))
    }
  }

  return (
    <div
      className={`sticky z-30 flex  w-full gap-3 overflow-x-auto bg-white text-center ${isFind ? "justify-start" : "justify-between"
        }`}
    >
      {memoLink.map((link) => (
        <Link
          prefetch={true}
          key={link.name}
          href={link.href}
          ref={link.active ? activeLinkRef : null}
          onClick={(e) => handleNavClick(e, link.href, link?.event)}
          className={clsx(
            "relative whitespace-nowrap py-3.5 text-xl",
            link.active ? "font-bold text-black" : "font-normal text-[#777]",
            isFind ? "mr-8" : ""
          )}
        >
          {link.name}
          <span
            className={clsx(
              "bg-theme absolute bottom-0 left-[50%] ml-[-20px] h-[3px] w-[40px] rounded-t-lg",
              link.active ? "block" : "hidden"
            )}
          ></span>
        </Link>
      ))}
    </div>
  )
}
