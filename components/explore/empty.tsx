"use client"
import { useTranslations } from "next-intl"

import Image from "next/image"


import { Link } from "@/i18n/routing"

export default function Empty({ text }: { text: string }) {
  const t = useTranslations("Explore")
  return (
    <div className="mt-40 flex flex-col place-items-center justify-center">
      <Image src="/icons/icon_detail_null@3x.png" alt="follow is null" width={200} height={150} />
      <span className="mt-6 text-center text-gray-500">
        {text}
        <Link href="/explore/feed">
          <span className="text-text-theme">{t("Feed")}</span>
        </Link>
      </span>
    </div>
  )
}
