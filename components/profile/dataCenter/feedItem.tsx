import { useState } from "react"

import { useTranslations } from "next-intl"

import { PostData } from "@/lib"
import { buildImageUrl } from "@/lib/utils"

import LazyImg from "../../common/lazy-img"
import IconWithImage from "../icon"


type TProps = {
  item: PostData
}


export default function Page({ item }: TProps) {
  const t = useTranslations("Profile")
  const countTypes = {
    play_count: t("dataCenter.playCount1"),
    comment_count: t("dataCenter.commentCount"),
    thumbs_up_count: t("dataCenter.thumbsUpCount"),
    share_count: t("dataCenter.shareCount"),
    tip_count: t("dataCenter.tipCount"),
    collection_count: t("dataCenter.collectionCount")
  }

  const { post_attachment, post, post_metric } = item
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className={`pl-4 ${isOpen ? "border-b border-b-gray-100" : ""}`}>
      <div className={` py-2 ${!isOpen ? "border-b border-b-gray-100" : ""}`}>
        <div className={"flex h-28 justify-between px-4 pl-0"}>
          <div className="mr-2 size-28 shrink-0 rounded-md bg-slate-200 bg-cover">
            <LazyImg
              className="aspect-square rounded-md object-cover"
              src={post_attachment ? buildImageUrl(post_attachment[0]?.thumb_id || post_attachment[0]?.file_id) : "/icons/image_draft.png"}
              alt=""
              width={112}
              height={112}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="line-clamp-2 text-ellipsis break-all">{post.title}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IconWithImage
                  url="/icons/space/icon_fans_play_s_gray@3x.png"
                  width={12}
                  color="#6D7781"
                  height={12}
                />
                <span className="ml-2 text-xs text-[#BBB]">{post_metric.play_count}</span>
              </div>
              <div className="flex items-center text-[#BBB]" onClick={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}
              >
                <span>{isOpen ? t("dataCenter.fold") : t("dataCenter.detail")}</span>
                <IconWithImage url="/icons/profile/icon-bt.png" width={14} height={14} color={"#BBB"} />
              </div>
            </div>
          </div>
        </div>
        {
          isOpen && (
            <div className="my-3 flex flex-wrap overflow-hidden transition-all duration-1000">
              {Object.keys(countTypes).map(v => (
                <div key={v} className="my-3 flex w-2/6 flex-col items-center justify-center">
                  <span className="text-[20px] font-medium">{post_metric[v as keyof typeof post_metric]}</span>
                  <span className="text-xs text-[#959595]">{countTypes[v as keyof typeof countTypes]}</span>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}