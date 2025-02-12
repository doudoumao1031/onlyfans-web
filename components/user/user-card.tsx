"use client"
import Avatar from "@/components/user/avatar"
import Image from "next/image"
import { BloggerInfo } from "@/lib"
import IconWithImage from "@/components/profile/icon"
import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"
import Link from "next/link"
import SubscribedButton from "@/components/explore/subscribed-button"
/**
 * 博主名片
 * @param user 用户信息
 * @param subscribe 是否订阅
 * @constructor
 */
export default function UserCard({ user, subscribe }: { user: BloggerInfo, subscribe: boolean }) {

  const cardContent = (
    <>
      <div className="flex justify-center w-full bg-black rounded-lg h-[100px]">
        <Image
          src={user.back_img ? buildImageUrl(user.back_img) : getUserDefaultBackImg(user.username)}
          width={280}
          height={100}
          alt=""
          className="w-full rounded-lg opacity-50"
        />
        <div className="w-full absolute flex-col h-[100px] px-4 text-white">
          <div className="h-4 text-xs text-nowrap px-1 pb-1 truncate">
            {user.about}
          </div>
          <div className="w-full">
            <div className="flex px-3 items-center justify-start">
              <div className="w-1/4">
                <Avatar src={user.photo} vlog={user.live_certification} />
              </div>
              <div className="flex-col w-3/4">
                <div>
                  <div className="font-medium">{user.first_name}</div>
                  <div className="font-normal">{user.username ? `@${user.username}` : `@${user.first_name}`}</div>
                </div>
                {subscribe && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-black bg-opacity-40 px-2 py-1 rounded-full flex items-center">
                        <IconWithImage
                          url="/icons/explore/icon_fans_info_photo_white@3x.png"
                          width={14}
                          height={14}
                        />
                        <span className=" text-xs ml-1">{user.img_count}</span>
                      </div>
                      <div className="bg-black bg-opacity-40 px-2 py-1 rounded-full flex items-start">
                        <IconWithImage
                          url="/icons/explore/icon_fans_info_video_white@3x.png"
                          width={14}
                          height={14}
                        />
                        <span className="text-xs ml-1">{user.video_count}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {
              !subscribe && (
                <div className="text-white text-xs absolute right-7 bottom-3">
                  今日新增: {user.today_add_count ?? 0}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="relative">
      <Link href={`/space/${user.id}/feed`}>
        {cardContent}
      </Link>
      {subscribe && !user.sub && (
        <div className="absolute right-4 bottom-4 z-10">
          <SubscribedButton userId={user.id} name={user.first_name} subPrice={user.sub_price} type={"button"} />
        </div>
      )}
    </div>
  )
}
