"use client"
import { useEffect, useRef } from "react"

import { useLocale, useTranslations } from "next-intl"

import Image from "next/image"

import { PostData, User } from "@/lib"
import { buildImageUrl } from "@/lib/utils"

import { useCommonMessageContext } from "../common/common-message"
import Avatar from "../profile/avatar"
import IconWithImage from "../profile/icon"
import UserCard from "../user/user-card"

function MomentTime(number: number) {
  const locale = useLocale()
  const t = useTranslations("ShortLink")
  const time = number * 1000
  const now = new Date()
  const moment = new Date(time)
  const diffMinutes = Math.floor((now.getTime() - moment.getTime()) / (1000 * 60))
  if (diffMinutes < 60) {
    return t("justNow")
  } else if (diffMinutes < 24 * 60) {
    return t("hoursAgo", { hours: Math.floor(diffMinutes / 60) })
  } else if (diffMinutes <= 3 * 24 * 60) {
    return t("daysAgo", { days: Math.floor(diffMinutes / (24 * 60)) })
  } else {
    if (locale === "en") {
      // 最后要显示“12 Apr” 这种格式
      const day = moment.getDate()
      const month = moment.toLocaleDateString("en", { month: "short" })
      return `${day} ${month}`
    } else {
      return moment.toLocaleDateString(locale, { day: "numeric", month: "long" })
    }
  }
}
export default function Page({ data, bloggers }: { data: PostData | undefined, bloggers: User[] }) {
  if (!data) {
    throw new Error()
  }
  const { user, post, post_attachment } = data
  const t = useTranslations("ShortLink")
  const { showMessage } = useCommonMessageContext()
  const divRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (divRef.current) {
      if (headerRef.current) {
        headerRef.current.style.height = divRef.current?.offsetHeight + "px"
      }
    }
  }, [])
  return (
    <div onTouchEnd={() => { showMessage("暂未配置App下载地址") }}>
      <div className="relative">
        <div ref={divRef} className="bg-theme fixed left-0 top-0 z-40 flex w-full justify-center">
          <section className="flex w-screen max-w-lg items-center justify-between px-4 align-middle text-black" style={{ aspectRatio: "375/44" }}>
            <div className="flex w-2/5 shrink-0 items-center justify-start gap-3">
              <IconWithImage url="/icons/checkbox_normal@3x.png" width={32} height={32} />
              <span className="text-xl font-medium text-white">{t("Potato")}</span>
            </div>
            <div className={"flex-1 text-center text-lg font-semibold"}></div>
            <div className="flex w-2/5 shrink-0 items-center justify-end gap-5">
              <span className="text-theme rounded-2xl bg-white px-[10px] py-[3px] text-sm font-normal">{t("downloadApp")}</span>
            </div>
          </section>
        </div>
      </div>
      <div ref={headerRef} className="h-[44px] w-full bg-white"></div>
      <section className="pointer-events-none relative bg-white">
        <section className="px-4 pb-2.5">
          <div className="mt-4 flex justify-between">
            <div className="flex w-4/5 items-center">
              <div className="shrink-0">
                <Avatar size={44} showLive={user.live_certification} fileId={user.photo} />
              </div>
              <div className="ml-2.5 flex-1 overflow-hidden">
                <h1 className="flex items-center gap-2 text-base font-bold">
                  <div className="truncate">
                    {user.first_name}
                  </div>
                </h1>
                <div className="text-text-desc text-xs">
                  {user.username
                    ? "@" + user.username
                    : !user.first_name && !user.about ? t("noUserName") : ""}
                </div>
              </div>
            </div>
            <div className="text-gray-secondary flex place-items-center text-xs">
              {MomentTime(post.pub_time)}
            </div>
          </div>
          <div className="mt-[6px] text-sm text-[#222]">
            <div>{user.about}</div>
            <div className=" mt-[6px] flex items-center text-xs">
              <span className="text-gray-secondary">
                {t("translate")}
              </span>
              <IconWithImage url={"/icons/profile/icon_arrow_down@3x.png"} width={16}
                height={16} color={"#888d91"}
              />
            </div>
          </div>
        </section>
        <section>

          {
            post_attachment.length > 0 && (post_attachment[0].thumb_id || post_attachment[0].file_id) && (
              <div className="video-poster relative h-[210px]">
                <Image src={buildImageUrl(post_attachment[0].thumb_id || post_attachment[0].file_id)} alt="video-poster" fill objectFit="cover" />
                <div className="absolute left-1/2 top-1/2 flex size-[60px] -translate-x-1/2 -translate-y-1/2 place-items-center justify-center rounded-full bg-black/40">
                  <IconWithImage url="/icons/play.png" width={24} height={24} />
                </div>
              </div>
            )
          }
          <div className="px-4 py-2.5">
            <UserCard user={user} />
            <div className="mt-2.5 flex items-center justify-between gap-4 text-[10px] font-medium text-[#4f6572]">
              <div className="flex items-center gap-1 ">
                <Image
                  src="/icons/profile/icon_fans_like_normal@3x.png"
                  width={15}
                  height={15}
                  alt=""
                />
                <span>{t("like")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/profile/icon_fans_comment_normal@3x.png"
                  width={15}
                  height={15}
                  alt=""
                />
                <span>{t("comment")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/profile/icon_fans_reward_normal@3x.png"
                  width={15}
                  height={15}
                  alt=""
                />
                <span>{t("tip")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/profile/icon_fans_share_normal@3x.png"
                  width={15}
                  height={15}
                  alt=""
                />
                <span>{t("share")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/profile/icon_fans_collect_normal@3x.png"
                  width={15}
                  height={15}
                  alt=""
                />
                <span>{t("save")}</span>
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-[#ddd] px-4 pb-2.5 pt-5">
          <div className="text-whire w-full px-4">
            <button className="bg-theme mb-5 w-full rounded-3xl px-4 py-[14px] text-center font-medium text-white">{t("openApp")}</button>
          </div>
          {bloggers?.length > 0 && (
            <>
              <div className="text-normal mb-2.5 text-sm font-medium">{t("relatedRecommendations")}</div>
              {bloggers.map((item: User) => (
                <div key={item.id} className="pointer-events-none mb-2.5 w-full">
                  <UserCard user={item} />
                </div>
              ))}
            </>
          )}
        </section>
      </section>
    </div >
  )
}
