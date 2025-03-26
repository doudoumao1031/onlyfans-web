"use client"
import { useTranslations } from "next-intl"

import { PostData, User } from "@/lib"
import { buildImageUrl } from "@/lib/utils"

import { useCommonMessageContext } from "../common/common-message"
import LazyImg from "../common/lazy-img"
import Avatar from "../profile/avatar"
import IconWithImage from "../profile/icon"
import UserCard from "../user/user-card"

export default function Page({ data, bloggers }: { data: PostData | undefined, bloggers: User[] }) {
  if (!data) {
    throw new Error()
  }
  const { user, post } = data
  const t = useTranslations("ShortLink")
  const { showMessage } = useCommonMessageContext()

  return (
    <div onTouchEnd={() => { showMessage("暂未配置App下载地址") }}>
      <div className="relative h-[109px]">
        <div className="absolute z-0 size-full">
          <LazyImg
            style={{ objectFit: "cover" }}
            width={200}
            height={400}
            className="size-full"
            src={user.back_img ? buildImageUrl(user.back_img) : "/icons/base-header.png"}
            alt={""}
          />
          <div className="absolute left-0 top-0 size-full bg-black/20"></div>
        </div>
        <div className="bg-theme fixed left-0 top-0 z-40 flex w-full justify-center">
          <section className="flex w-screen max-w-lg items-center justify-between px-4 align-middle text-black" style={{ aspectRatio: "375/44" }}>
            <div className="flex w-2/5 shrink-0 items-center justify-start gap-3">
              <IconWithImage url="/icons/checkbox_normal@3x.png" width={32} height={32} />
              <span className="text-xl font-medium text-white">{t("Potato")}</span>
            </div>
            <div className={"flex-1 text-center text-[18px] font-semibold"}></div>
            <div className="flex w-2/5 shrink-0 items-center justify-end gap-5">
              <span className="text-theme rounded-2xl bg-white px-[10px] py-[3px] text-sm font-normal">{t("downloadApp")}</span>
            </div>
          </section>
        </div>
      </div>
      <section className="relative bg-white">
        <section className="px-5 pb-5">
          <div className={"flex justify-between"}>
            <div className={"relative top-[-24px]"}>
              <Avatar size={44} showLive={user.live_certification} fileId={user.photo} />
              <h1 className="flex items-center gap-2 text-[18px] font-bold">
                <span>
                  {user.first_name}
                </span>
              </h1>
              {/* <div className="text-text-desc text-center text-xs">
                {data.username
                  ? "@" + data.username
                  : !data.first_name && !data.about ? t("noUserName") : ""}
              </div> */}
              <div>

              </div>
            </div>
          </div>
          <div className="mt-[-7px] text-sm text-[#222]">
            <h3 className="text-xs font-medium">{t("description")}</h3>
            <div className="mt-[5px] line-clamp-1 ">{user.about}</div>
          </div>
        </section>
        <section className="border-t border-[#ddd] px-4 pb-2.5 pt-5">
          <div className="text-whire w-full px-4">
            <button className="bg-theme w-full rounded-3xl px-4 py-[14px] text-center font-medium text-white">{t("openApp")}</button>
          </div>
          <div className="text-theme mt-5 font-medium">
            <div>{t("joinPotato")}</div>
            <div className="ml-[70px]">{t("deepInPotato")}</div>
            <div className="mt-2.5 flex justify-center">
              <div className={"border-theme w-fit rounded-full border px-[11.5px] py-[3.5px] text-center"}> {t("joinPotatoChat")}
              </div>
            </div>
          </div>
          <div className="text-theme mt-5">{t("joinPotatoDescription")}</div>
        </section>
        <section className="px-4">
          {bloggers?.length > 0 && bloggers.map((item: User) => (
            <div key={item.id} className="pointer-events-none mb-[10px] w-full">
              <UserCard user={item} />
            </div>
          ))}
        </section>
      </section>
    </div>
  )
}
