import { useState } from "react"
import IconWithImage from "../icon"
import { PostData } from "@/lib"
import { buildImageUrl } from "@/lib/utils"
import LazyImg from "../../common/lazy-img"
import { useTranslations } from "next-intl"
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
    <div className={`pl-4 ${isOpen ? "border-b-gray-100 border-b" : ""}`}>
      <div className={` py-2 ${!isOpen ? "border-b-gray-100 border-b" : ""}`}>
        <div className={"h-28 flex justify-between px-4 pl-0"}>
          <div className="h-28 w-28 bg-cover mr-2 shrink-0 rounded-md bg-slate-200">
            <LazyImg
              className="aspect-square rounded-md object-cover"
              src={post_attachment ? buildImageUrl(post_attachment[0]?.thumb_id || post_attachment[0]?.file_id) : "/icons/image_draft.png"}
              alt=""
              width={112}
              height={112}
            />
          </div>
          <div className="flex flex-col justify-between flex-1">
            <div className="break-all text-ellipsis line-clamp-2">{post.title}</div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <IconWithImage
                  url="/icons/space/icon_fans_play_s_gray@3x.png"
                  width={12}
                  color="#6D7781"
                  height={12}
                />
                <span className="text-[#BBB] text-xs ml-2">{post_metric.play_count}</span>
              </div>
              <div className="text-[#BBB] flex items-center" onClick={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}>
                <span>{isOpen ? t("dataCenter.fold") : t("dataCenter.detail")}</span>
                <IconWithImage url="/icons/profile/icon-bt.png" width={14} height={14} color={"#BBB"} />
              </div>
            </div>
          </div>
        </div>
        {
          isOpen && (
            <div className="flex flex-wrap mt-3 mb-3 overflow-hidden transition-all duration-1000">
              {Object.keys(countTypes).map(v => (
                <div key={v} className="w-2/6 flex justify-center items-center flex-col mt-3 mb-3">
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