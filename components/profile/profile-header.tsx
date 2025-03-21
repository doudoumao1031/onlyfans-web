"use client"
import { useCallback, useEffect, useRef, useState } from "react"

import { useTranslations } from "next-intl"

import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import { Link } from "@/i18n/routing"
import { UserProfile } from "@/lib/actions/profile"
import { buildImageUrl } from "@/lib/utils"

import LazyImg from "../common/lazy-img"



export default function ProfileHeader({ data }: { data: UserProfile | undefined }) {
  if (!data) {
    throw new Error()
  }
  const t = useTranslations("Profile")
  const bgRef = useRef<HTMLDivElement>(null)
  const [isTop, setIsTop] = useState<boolean>(false)
  const divRef = useRef<HTMLDivElement>(null)
  const handleShare = useCallback(() => {
    try {
      const broadcasterData = {
        type: "broadcaster",
        firstName: data?.first_name,
        lastName: data?.last_name,
        username: data?.username,
        fansId: data?.id.toString(),
        photoId: data?.photo
      }
      console.log(broadcasterData, "broadcasterData")

      window.callAppApi("ShareText", JSON.stringify(broadcasterData))
    } catch (error) {
      console.log("分享失败", error)
    }
  }, [data])
  useEffect(() => {
    if (divRef.current) {
      // 获取 CSS 变量 --top-bar 的值
      const topBarValue = getComputedStyle(document.documentElement).getPropertyValue("--top-bar").trim()
      // 检查 --top-bar 的值，并根据其值修改样式
      if (topBarValue) {
        // 例如，如果 --top-bar 存在且不为 0，则修改 top 样式
        divRef.current.style.top = topBarValue !== "0vw" ? topBarValue : "0"
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTop(!entry.isIntersecting)
      },
      {
        threshold: 0.7
      }
    )
    const currentBgRef = bgRef.current
    if (currentBgRef) {
      observer.observe(currentBgRef)
    }
    return () => {
      if (currentBgRef) {
        observer.unobserve(currentBgRef)
      }
    }
  }, [])
  return (
    <div className="relative h-[158px]">
      <div className="absolute z-0 size-full" ref={bgRef}>
        <LazyImg
          style={{ objectFit: "cover" }}
          width={200}
          height={400}
          className="size-full"
          src={data.back_img ? buildImageUrl(data.back_img) : "/icons/base-header.png"}
          alt={""}
        />
        <div className="absolute left-0 top-0 size-full bg-black/20"></div>
      </div>
      <div ref={divRef} className={`fixed left-0 top-0 z-40 w-full ${isTop ? "bg-white" : "auto"}`}>
        <Header
          title={
            <span
              className={`shrink-0 pt-px text-[18px] font-semibold  ${isTop ? "text-[#222]" : "text-white"
                }`}
            >
              {t("mainTitle")}
            </span>
          }
          right={
            <>
              <Link className="flex items-center justify-center" href={`/profile/share/${data.id}`}>
                <IconWithImage
                  url="/icons/space/icon_nav_code_black@3x.png"
                  width={22}
                  height={22}
                  color={isTop ? "#222" : "#fff"}
                />
              </Link>
              <button type="button" onTouchEnd={handleShare}>
                <IconWithImage
                  url="/icons/space/icon_fans_share_normal@3x.png"
                  width={22}
                  height={22}
                  color={isTop ? "#222" : "#fff"}
                />
              </button>
            </>
          }
          backIconColor={isTop ? "#222" : "#fff"}
        />
        <div className={`truncate px-6 pb-2 text-xs ${isTop ? "text-theme" : "text-white"}`}>
          {data.top_info}
        </div>
      </div>
    </div>
  )
}
