"use client"
import { useState } from "react"

import { useTranslations } from "next-intl"

import { useRouter } from "next/navigation"


import SubscribedDrawer from "@/components/explore/subscribed-drawer"
import CommonRecharge from "@/components/post/common-recharge"
import Avatar from "@/components/profile/avatar"
import IconWithImage from "@/components/profile/icon"
import Directions from "@/components/space/directions"
import { UserProfile } from "@/lib/actions/profile"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"

import Attention from "./attention"
import SpaceHeader from "./space-header"




export default function UserInfo({
  data,
  isSelf
}: {
  data: UserProfile | undefined
  isSelf: boolean
}) {
  // const response = await userProfile()
  // const data = response?.data
  if (!data) {
    throw new Error()
  }
  const t = useTranslations("Space")
  const router = useRouter()
  const { addToActionQueue } = useGlobal()
  const tabs = [
    { icon: "/icons/space/icon_info_video@3x.png", num: data.video_count }, //视频
    { icon: "/icons/space/icon_info_photo@3x.png", num: data.img_count }, //图片
    { icon: "/icons/space/icon_info_like@3x.png", num: data.post_start_count }, //帖子点赞数量
    { icon: "/icons/space/icon_info_follownumber@3x.png", num: data.fans_count } //关注==粉丝
  ]
  const [visible, setVisible] = useState<boolean>(false)
  const [recharge, setRecharge] = useState<boolean>(false)

  return (
    <div className="w-full">
      <SpaceHeader data={data} />
      <section className="relative mt-[-47px] rounded-t-3xl bg-white  pt-12 text-black " id="refEl">
        <section className="px-4 pb-3 ">
          <Avatar showLive={data.live_certification} fileId={data.photo} />

          <h1 className="flex items-center justify-center text-center text-[18px] font-bold">
            <span>
              {data.first_name}
            </span>
          </h1>
          {!isSelf && <Attention data={data} />}
          <div className="text-center text-xs text-gray-400">
            {data.username
              ? "@" + data.username
              : !data.first_name && !data.about ? t("noUserName") : ""}
          </div>
          <div className="mt-1 flex justify-center">
            <IconWithImage
              url="/icons/icon_info_location.png"
              width={16}
              height={18}
              color="#222"
            />
            <span className="ml-1 max-w-[130px] truncate text-xs text-gray-400">{data.location || "北京"}</span>
          </div>
          <div className="my-6 flex justify-between px-1">
            {tabs.map((v) => (
              <div key={v.icon} className="flex items-center justify-center">
                <IconWithImage url={v.icon} width={20} height={20} color="#222" />
                <span className="ml-1 text-[#777]">{v.num}</span>
              </div>
            ))}
          </div>
          <Directions about={data.about} />
          {!isSelf && !data.sub && (
            <SubscribedDrawer
              userId={data.id}
              name={`${data.first_name} ${data.last_name}`}
              free={data.sub_price === 0}
              setRechargeModel={setVisible}
              flush={() => {
                router.refresh()
                addToActionQueue({
                  type: ActionTypes.SPACE.REFRESH
                })
              }}
            >
              <div className="mt-2 flex h-12  w-full flex-col items-start justify-center rounded-lg bg-[url('/theme/bg_space_subscription@3x.png')] bg-cover pl-4 text-white">
                <div>{t("subscribe")}</div>
                <div className="text-xs">
                  {data.sub_price === 0 ? t("free") : `${data.sub_price} USDT/${t("month")}`}
                </div>
              </div>
            </SubscribedDrawer>
          )}
        </section>
      </section>
      <CommonRecharge
        visible={visible}
        setVisible={setVisible}
        recharge={recharge}
        setRecharge={setRecharge}
      />
    </div>
  )
}
