import { useState } from "react"
import IconWithImage from "../icon"
import { PostData } from "@/lib"
import { buildImageUrl } from "@/lib/utils"
type TProps = {
  item: PostData
}

const countTypes = {
  play_count: '播放',
  comment_count: '评论',
  thumbs_up_count: '点赞',
  share_count: '分享',
  tip_count: '打赏',
  collection_count: '收藏',
}

export default function Page({ item }: TProps) {
  const { post_attachment, post, post_metric } = item
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return <div className={`pl-4 ${isOpen ? "border-b-gray-100 border-b" : ""}`}>
    <div className={` py-2 ${!isOpen ? "border-b-gray-100 border-b" : ""}`}>
      <div className={"h-28 flex justify-between px-4 pl-0"}>
        <div style={{
          backgroundImage: `url(${buildImageUrl(post_attachment[0]?.thumb_id || post_attachment[0]?.file_id)})`
        }} className={`h-28 w-28 bg-cover mr-2 shrink-0 rounded-md bg-slate-200`}></div>
        <div className="flex flex-col justify-between flex-1">
          <div className="fbreak-all text-ellipsis line-clamp-2">{post.title}</div>
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
            <div className="text-[#BBB] flex items-center" onClick={() => { setIsOpen(!isOpen) }}>
              <span>{isOpen ? "收起" : "详细"}</span>
              <IconWithImage url="/icons/profile/icon-bt.png" width={14} height={14} color={"#BBB"} />
            </div>
          </div>
        </div>
      </div>
      {
        isOpen && <div className={`flex flex-wrap mt-3 mb-3 overflow-hidden transition-all duration-1000`}>
          {Object.keys(countTypes).map(v => (
            <div key={v} className="w-2/6 flex justify-center items-center flex-col mt-3 mb-3">
              <span className="text-[20px] font-medium">{post_metric[v as keyof typeof post_metric]}</span>
              <span className="text-xs text-[#959595]">{countTypes[v as keyof typeof countTypes]}</span>
            </div>
          ))}
        </div>
      }
    </div>
  </div>
}