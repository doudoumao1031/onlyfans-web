"use client"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import { FileType, PostData } from "@/lib"
import { useGlobal } from "@/lib/contexts/global-context"
import { buildImageUrl } from "@/lib/utils"

import LazyImg from "../common/lazy-img"
import IconWithImage from "../profile/icon"

export default function MediaItem({ item }: { item: PostData }) {
  const { sid } = useGlobal()
  const t = useTranslations("Space")
  if (!item) return null
  const { post_attachment, post_price, user, post, post_metric } = item

  const showIds = post_attachment.map((v) => v.file_id).join("_")
  // 是否不可查看
  const lock = user.id !== sid && (post.visibility === 1 && !user.sub) || post.visibility === 2
  /*（订阅需要付费 && 未关注博主 && 未订阅博主） || （订阅不需要付费 && 未订阅） => 跳转详情页 */
  const toDetail = user.id !== sid && ((user.sub_price > 0 && !user.following && !user.sub) || (user.sub_price === 0 && !user.sub) || lock)
  return (
    <div className="mt-4 h-[220px] w-[calc(50%_-_8px)]">
      <div className="relative mb-4 flex size-full  flex-col justify-between overflow-hidden rounded-lg bg-gray-300 bg-cover text-xs text-white">
        <div className="absolute size-full">
          <LazyImg
            style={{ objectFit: "cover" }}
            width={200}
            height={400}
            className="size-full"
            src={
              post_attachment[0]?.thumb_id || post_attachment[0]?.file_id
                ? buildImageUrl(post_attachment[0]?.thumb_id || post_attachment[0]?.file_id)
                : "/icons/default/img_media_default.png"
            }
            alt={""}
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {lock && (
          <div className="absolute left-0 top-0 z-0 size-full rounded-lg bg-black bg-opacity-5 backdrop-blur"></div>
        )}

        <Link href={toDetail ?
          `/postInfo/${post.id}` : `/media/${post_attachment[0]?.file_type === FileType.Video ? "video" : "image"}/${post_attachment[0]?.file_type === FileType.Video ?
            showIds + "_" + post.id : showIds + "_" + 0}`}
        >
          <div className="absolute left-0 top-0 z-10 flex size-full flex-col justify-between">
            <div className="truncate p-2">
              {/* {!lock ? post.title : ""} */}
            </div>
            {lock && (
              <div className="flex flex-col items-center justify-center">
                <IconWithImage
                  url="/icons/icon_info_lock_white.png"
                  width={32}
                  color="#fff"
                  height={32}
                />
                <span className="mt-2">{post.visibility === 2 ? t("tip1") : t("tip2")}</span>
              </div>
            )}
            <div className="flex justify-between p-2">
              <span className="flex items-center">
                <IconWithImage
                  url="/icons/space/icon_fans_play_s_gray@3x.png"
                  width={12}
                  color="#fff"
                  height={12}
                />
                <span className="ml-1 text-white">{post_metric.play_count}</span>
              </span>
              {!lock ? (
                <span className="flex items-center ">
                  <IconWithImage
                    url="/icons/space/icon_fans_money_s_gray@3x.png"
                    width={12}
                    color="#fff"
                    height={12}
                  />
                  {post_price ? (
                    <span className="ml-1 text-white">${post_price[0].price}</span>
                  ) : (
                    <span></span>
                  )}
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
