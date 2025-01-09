import Link from "next/link"
import Image from "next/image"
import NavLinks from "@/components/explore/nav-links"

export default function Nav() {
  return (
    <div className="flex flex-row w-full h-14 px-3">
      <div className="flex grow flex-row justify-between items-center">
        <NavLinks />
      </div>
      <Link className="flex items-center justify-center" href="/search">
        <Image
          src="/icons/explore/icon_nav_search@3x.png"
          width={24}
          height={24}
          alt="Search content or bloger"
        />
      </Link>
    </div>
  )
}