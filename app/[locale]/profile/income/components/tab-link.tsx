"use client"
import clsx from "clsx"
import { Link } from "@/i18n/routing"
import { useCallback } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
export default function TabLinks() {
  const t = useTranslations("Profile.income")
  const pathName = usePathname()
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
    { name: t("incomeCenter"), href: "/profile/income/incomeView" },
    { name: t("expensesRecord"), href: "/profile/income/expenses" }
  ]
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
          <span
            className={clsx(
              "absolute left-[50%] bottom-0 h-[3px] rounded-tl-lg rounded-tr-lg bg-black w-[40px] ml-[-20px]",
              pathName.endsWith(link.href) ? "block" : "hidden"
            )}
          ></span>
        </Link>
      ))}
    </div>
  )
}
