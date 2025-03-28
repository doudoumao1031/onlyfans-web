"use client"
import { useState } from "react"

import dayjs from "dayjs"
import { useTranslations } from "next-intl"

import IconWithImage from "@/components/profile/icon"

export default function FoldingDescription({
  about,
  location,
  birthday,
  joinTime
}: {
  about: string
  location: string,
  birthday: number,
  joinTime: number
}) {
  const t = useTranslations("Profile")
  const [hideState, setHideState] = useState(true)
  return (
    <>
      <section
        className={hideState && about?.length > 100 ? "line-clamp-3" : "whitespace-pre-wrap"}
        dangerouslySetInnerHTML={{ __html: about }}
      ></section>

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
      {
        !hideState && (
          <div className={"text-gray-secondary mt-1.5 flex gap-2 text-xs"}>
            <div className={"flex flex-1 gap-1 overflow-hidden"}>
              {location ? (
                <>
                  <div className={"shrink-0"}>
                    <IconWithImage
                      url={"/icons/profile/icon-address.png"}
                      width={16}
                      height={16}
                      color={"#222"}
                    />
                  </div>
                  <span className={"flex-1 truncate whitespace-nowrap "}>{location}</span>
                </>
              ) : null}
            </div>
            {birthday && (<div className={"shrink-0"}>生日{dayjs(birthday * 1000).format("YYYY-MM-DD")}</div>)}
            {joinTime && (<div className={"shrink-0"}>{dayjs(joinTime * 1000).format("YYYY-MM-DD")}加入</div>)}
          </div>
        )
      }
    </>
  )
}
