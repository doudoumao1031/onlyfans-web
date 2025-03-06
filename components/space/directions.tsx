"use client"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function Page({ about }: { about: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const t = useTranslations("Space")
  return (
    <div className="text-xs mt-2.5">
      <section
        className={!isOpen && about?.length > 100 ? "line-clamp-3" : "whitespace-pre-wrap"}
        dangerouslySetInnerHTML={{ __html: about }}
      ></section>
      {about?.length > 100 && (
        <button
          className="text-text-theme mt-1"
          onTouchEnd={() => {
            setIsOpen(!isOpen)
          }}
        >
          {isOpen ? t("foldInfo") : t("moreInfo")}
        </button>
      )}
    </div>
  )
}
