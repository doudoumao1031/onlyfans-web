"use client"
import { useState } from "react"
import IconWithImage from "@/components/profile/icon"
import { useTranslations } from "next-intl"

export default function FoldingDescription ({ about,location }:{about:string,location: string}) {
  const t = useTranslations("Profile")
  const [hideState,setHideState] = useState(true)
  return (
    <>
      <section className={"overflow-hidden whitespace-pre-wrap"} style={{ height: hideState ? "2.5em" : "auto" }} dangerouslySetInnerHTML={{ __html:about }}></section>
      {
        !hideState && (
          <>
            <div className={"flex text-xs gap-1 mt-1.5 text-[#6D7781]"}>
              <IconWithImage
                url={"/icons/profile/icon-address.png"}
                width={16}
                height={16}
                color={"#222"}
              />
              <span>{location}</span>
            </div>
          </>
        )
      }
      {about && hideState && (
        <button className="text-text-theme mt-1" type={"button"} onTouchEnd={() => {
          setHideState(false)
        }}
        >{t("actions.moreInfo")}</button>
      )}
    </>
  )
}