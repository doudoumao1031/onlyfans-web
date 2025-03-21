"use client"

import { useTranslations } from "next-intl"
import { useDebouncedCallback } from "use-debounce"

import Image from "next/image"
import { useSearchParams, usePathname, useRouter } from "next/navigation"


export default function SearchInput({ placeholder }: { placeholder: string }) {
  const t = useTranslations("Common")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, back } = useRouter()
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)
  return (
    <div className="relative flex h-12 w-full items-center justify-between py-[6px] pl-3 pr-4">
      <input className="mr-4 size-full rounded-full bg-gray-50 pl-8"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get("search")?.toString()}
      />
      <Image src="/icons/icon_search_s@3x.png" alt="search"
        width={18}
        height={18}
        className="absolute left-6 top-1/3"
      />
      <button className="shrink-0" onClick={() => { back() }}>
        <span className="text-text-theme w-8 text-nowrap text-lg font-normal">{t("cancel")}</span>
      </button>
    </div>
  )
}
