"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import Image from "next/image"

export default function SearchInput({ placeholder }: { placeholder: string }) {
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
    <div className="w-full h-12 pl-3 pr-4 py-[6px] relative flex justify-between items-center">
      <input className="w-full h-full bg-gray-50 rounded-full mr-4 pl-8"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get("search")?.toString()}
      />
      <Image src="/icons/icon_search_s@3x.png" alt="search"
        width={18}
        height={18}
        className="absolute top-1/3 left-6"
      />
      <button onClick={() => {back()}}>
        <span className="text-text-pink text-lg font-normal text-nowrap w-8">取消</span>
      </button>
    </div>
  )
}
