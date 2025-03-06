"use client"
import { useState } from "react"
import IconWithImage from "@/components/profile/icon"
import { useTranslations } from "next-intl"

export default function FoldingDescription({
  about,
  location
}: {
  about: string
  location: string
}) {
  const t = useTranslations("Profile")
  const [hideState, setHideState] = useState(true)
  return (
    <>
      <section
        className={hideState && about?.length > 100 ? "line-clamp-3" : "whitespace-pre-wrap"}
        dangerouslySetInnerHTML={{ __html: about }}
      ></section>
      {(!hideState || about?.length < 100) && (
        <>
          {location ? (
            <div className={"flex text-xs gap-1 mt-1.5 text-[#6D7781] break-all whitespace-normal"}>
              <div className={"shrink-0"}>
                <IconWithImage
                  url={"/icons/profile/icon-address.png"}
                  width={16}
                  height={16}
                  color={"#222"}
                />
              </div>
              <span>{location}</span>
            </div>
          ) : null}
        </>
      )}
      {about?.length > 100 && (
        <button
          className="text-text-theme mt-1"
          onTouchEnd={() => {
            setHideState(!hideState)
          }}
        >
          {!hideState ? t("foldInfo") : t("moreInfo")}
        </button>
      )}
    </>
  )
}
