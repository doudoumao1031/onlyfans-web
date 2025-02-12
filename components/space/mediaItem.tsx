import { useState } from "react"
import IconWithImage from "../profile/icon"
import { FileType, PostData } from "@/lib"
import { buildImageUrl } from "@/lib/utils"
import Link from "next/link"
import { ParamValue } from "next/dist/server/request/params"
import LazyImg from "../common/lazy-img"
export default function Page({ item, id }: { item: PostData; id: ParamValue }) {
  const [isClick, setIsClick] = useState<boolean>(false)
  if (!item) return null
  const { post_attachment, post_price, user, post, post_metric } = item
  const showIds = post_attachment.map((v) => v.file_id).join("_")
  return (
    <Link
      className="w-[calc(50%_-_8px)] h-[220px] mt-4"
      href={
        post.visibility === 1 && !user.sub
          ? "javascript:void(0);"
          : `/space/${id}/media/${
              post_attachment[0].file_type === FileType.Video ? "video" : "image"
            }/${post_attachment[0].file_type === FileType.Video ? showIds : showIds + "_" + 0}}`
      }
    >
      <div
        onClick={() => {
          setIsClick(!isClick)
        }}
        // style={{
        //   backgroundImage: `url(${buildImageUrl(
        //     post_attachment[0].thumb_id || post_attachment[0].file_id
        //   )})`
        // }}
        className=" overflow-hidden relative rounded-lg text-xs  text-white flex flex-col justify-between w-full h-full mb-4 bg-cover  bg-gray-300"
      >
        <div className="absolute w-full h-full">
          <LazyImg
            style={{ objectFit: "cover" }}
            width={200}
            height={400}
            className="w-full h-full"
            src={buildImageUrl(post_attachment[0].thumb_id || post_attachment[0].file_id)}
            alt={""}
          />
        </div>
        <div className="z-10 w-full h-full flex flex-col justify-between absolute top-0 left-0">
          <div className="p-2 truncate overflow-hidden text-ellipsis">
            {!(post.visibility === 1 && !user.sub && isClick) ? post.title : ""}
          </div>
          {post.visibility === 1 && !user.sub && isClick && (
            <div className="flex flex-col items-center justify-center">
              <IconWithImage
                url="/icons/icon_info_lock_white.png"
                width={32}
                color="#fff"
                height={32}
              />
              <span className="mt-2">订阅内容，请订阅后查看</span>
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
              <span className="ml-1">{post_metric.play_count}</span>
            </span>
            {!(post.visibility === 1 && !user.sub && isClick) ? (
              <span className="flex items-center ">
                <IconWithImage
                  url="/icons/space/icon_fans_money_s_gray@3x.png"
                  width={12}
                  color="#fff"
                  height={12}
                />
                {post_price ? <span className="ml-1">${post_price[0].price}</span> : <span></span>}
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>

        {post.visibility === 1 && !user.sub && (
          <div className="w-full h-full bg-black bg-opacity-5 rounded-lg backdrop-blur absolute top-0 left-0 z-[0]"></div>
        )}
      </div>
    </Link>
  )
}
