import Image from "next/image"

import NavLinks from "@/components/explore/nav-links"
import { Link } from "@/i18n/routing"

export default function Nav({ isFind }: { isFind?: boolean }) {
  return (
    <div className="flex h-14 w-full flex-row border-b border-gray-100">
      <div className="flex flex-1 overflow-hidden px-3">
        <NavLinks isFind={isFind} />
      </div>
      {!isFind && (
        <Link
          className="flex shrink-0 items-center justify-center px-3 shadow-[-5px_0_4px_-1px_rgba(0,0,0,0.04)]"
          href="/search"
        >
          <Image
            src="/icons/explore/icon_nav_search@3x.png"
            width={24}
            height={24}
            alt="Search content or bloger"
          />
        </Link>
      )}
    </div>
  )
}
