import { useTranslations } from "next-intl"

import Image from "next/image"


import { buildMention } from "@/components/post/utils"
import IconWithImage from "@/components/profile/icon"
import AvatarVlog from "@/components/user/avatar-vlog"
import { Link } from "@/i18n/routing"
import { User } from "@/lib"
import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"


/**
 * 博主名片
 * @param user 用户信息
 * @param subscribe 是否订阅
 * @constructor
 */
export default function UserCard({ user, subscribe }: { user: User, subscribe: boolean }) {
  const t = useTranslations("Explore")
  const cardContent = (
    <>
      <div className="flex h-[100px] w-full justify-center rounded-lg bg-black">
        <Image
          src={user.back_img ? buildImageUrl(user.back_img) : getUserDefaultBackImg(user.username)}
          width={280}
          height={100}
          alt=""
          className="w-full rounded-lg opacity-50"
        />
        <div className="absolute h-[100px] w-full flex-col px-4 text-white">
          <div className="my-1 h-4 truncate text-nowrap px-1 pb-1 text-xs">{user.about}</div>
          <div className="w-full">
            <div className="flex items-center justify-start px-3">
              <div className="mr-4">
                <AvatarVlog user={user} />
              </div>
              <div className="w-3/4 flex-col">
                <div>
                  <div className="w-[85%] truncate text-nowrap text-sm font-medium">{`${user.first_name} ${user.last_name}`}</div>
                  <div className="w-[75%] truncate text-xs font-normal">{buildMention(user.username)}</div>
                </div>
                {subscribe && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-full bg-black bg-opacity-40 px-2.5 py-1">
                        <IconWithImage
                          url="/theme/icon_fans_info_photo_white@3x.png"
                          width={14}
                          height={14}
                        />
                        <span className=" ml-1 text-xs">{user.img_count}</span>
                      </div>
                      <div className="flex items-start rounded-full bg-black bg-opacity-40 px-2.5 py-1">
                        <IconWithImage
                          url="/theme/icon_fans_info_video_white@3x.png"
                          width={14}
                          height={14}
                        />
                        <span className="ml-1 text-xs">{user.video_count}</span>
                      </div>
                    </div>
                    {subscribe && (
                      <div className="">
                        {/*<SubscribedButton userId={user.id} name={user.first_name} subPrice={user.sub_price} type={"button"}/>*/}
                        <div className="self-start rounded-full bg-black bg-opacity-40 px-3 py-1 text-white">
                          <span className="text-nowrap text-xs">{user.sub ? t("recommended.subscribed") : user.sub_price > 0 ? t("recommended.freeAndSubscription") : t("recommended.free")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {!subscribe && (
              <div className="absolute bottom-3 right-7 text-xs text-white">
                {t("TodayAdded")}: {user.today_add_count ?? 0}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="relative">
      <Link href={`/space/${user.id}/feed`} className="">
        {cardContent}
      </Link>
    </div>
  )
}
