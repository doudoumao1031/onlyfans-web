"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "已订阅", href: "/explore/subscribed" },
  { name: "关注", href: "/explore/followed" },
  { name: "精彩贴文", href: "/explore/feed" },
  { name: "推荐博主", href: "/explore/recommended" },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex w-full border-b border-gray-300">
      {links.map((link) => (
        <Link
          prefetch={true}
          key={link.name}
          href={link.href}
          className={clsx(
            "flex grow items-center justify-center text-sm font-medium py-2 hover:text-blue-600",
            {
              "border-b-2 border-black text-black": pathname === link.href,
              "text-gray-400": pathname !== link.href,
            }
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
