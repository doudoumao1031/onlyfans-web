"use client"
import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import { UserProfile } from "@/lib/actions/profile"
import { buildImageUrl } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useEffect, useRef, useState } from "react"
import LazyImg from "../common/lazy-img"
import { useTranslations } from "next-intl"
import CommonAvatar from "../common/common-avatar"
import { getSelfId } from "@/lib/actions/server-actions"
import { buildMention } from "../post/utils"
export default function SpaceHeader({ data }: { data: UserProfile | undefined }) {
  if (!data) {
    throw new Error()
  }

  const t = useTranslations("Space")
  const bgRef = useRef<HTMLDivElement>(null)
  const [isTop, setIsTop] = useState<boolean>(false)
  const [isSelf, setIsSelf] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

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
    getIsSelf(data.id.toString())
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTop(!entry.isIntersecting)
      },
      {
        threshold: 0.7
      }
    )

    if (bgRef.current) {
      observer.observe(bgRef.current)
    }

    return () => {
      if (bgRef.current) {
        observer.unobserve(bgRef.current)
      }
    }
  }, [])
  const getIsSelf = async (userId: string) => {
    const selfId = await getSelfId()
    setIsSelf(selfId === userId)
  }
  const renderTitle = () => {
    if (isSelf) return t("mySpace")
    return (
      <div className="flex-1 flex items-center ">
        <div className="w-8 h-8">
          <CommonAvatar photoFileId={data.photo} size={32} />
        </div>
        <div className="ml-2">
          <div className="text-[14px] truncate max-w-[150px]">
            {data.first_name}
          </div>
          <div className="text-black/50 text-[12px]">{buildMention(data.username)}</div>
        </div>
      </div>
    )
  }
  return (
    <div className=" relative h-[200px]">
      <div className="absolute w-full h-full z-0" ref={bgRef}>
        <LazyImg
          style={{ objectFit: "cover" }}
          width={200}
          height={400}
          className="w-full h-full"
          src={data.back_img ? buildImageUrl(data.back_img) : "/icons/base-header.png"}
          alt={""}
        />
      </div>
      <div ref={divRef} className={`w-full fixed top-0 left-0 z-40 ${isTop ? "bg-[#fff]" : "auto"}`}>
        <Header
          leftTitle={
            <span
              className={` pt-[1px] shrink-0 text-[18px] font-semibold ml-8 ${isTop ? "text-[#222]" : "text-[#fff]"
                }`}
            >
              {isTop ? renderTitle() : ""}

            </span>
          }
          right={
            <>
              <Link className="flex items-center justify-center" href="/search">
                <IconWithImage
                  url="/icons/space/icon_nav_search@3x.png"
                  width={22}
                  height={22}
                  color={isTop ? "#222" : "#fff"}
                />
              </Link>
              <Link className="flex items-center justify-center" href="/profile/share">
                <IconWithImage
                  url="/icons/space/icon_nav_code_black@3x.png"
                  width={22}
                  height={22}
                  color={isTop ? "#222" : "#fff"}
                />
              </Link>
              <div>
                <IconWithImage
                  url="/icons/space/icon_fans_share_normal@3x.png"
                  width={22}
                  height={22}
                  color={isTop ? "#222" : "#fff"}
                />
              </div>
            </>
          }
          backIconColor={isTop ? "#222" : "#fff"}
        />
        <div className={`text-xs truncate pl-6 pr-6 pb-2 ${isTop ? "text-theme" : "text-white"}`}>
          {data.top_info}
        </div>
      </div>
    </div>
  )
}
