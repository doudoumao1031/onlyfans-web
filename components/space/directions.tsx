"use client"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function Page({ about }: { about: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const t = useTranslations("Space")
  return (
    <div className="text-xs mt-2.5">
      <section
        className={!isOpen ? "flex h-4 overflow-hidden text-ellipsis ..." : "whitespace-pre-wrap"}
        dangerouslySetInnerHTML={{ __html: about }}
      ></section>
      <button
        className="text-text-theme mt-1"
        onTouchEnd={() => {
          setIsOpen(!isOpen)
        }}
      >
        {isOpen ? t("foldInfo") : t("moreInfo")}
      </button>
    </div>
  )
}
