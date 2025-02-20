"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  type?: number;
  setType?: (type: number) => void;
}

export default function Header() {
  const pathname = usePathname()
  const tabs = [
    { path: "/explore/recommended/hot", label: "热门推荐" },
    { path: "/explore/recommended/new", label: "新人推荐" },
    { path: "/explore/recommended/popular", label: "🔥人气博主" }
  ]

  return (
    <div className="gap-3 w-full overflow-x-auto flex justify-around mb-4">
      {tabs.map((tab) => (
        <Link key={tab.path} href={tab.path}
          className={`flex flex-shrink-0 whitespace-nowrap items-center justify-center ${pathname === tab.path ? "bg-background-pink text-white" : "bg-white text-text-pink"} border border-border-pink rounded-full px-5 py-1`}
        >
          <span className="text-nowrap font-medium text-base">{tab.label}</span>
        </Link>
      ))}
    </div>
  )
}