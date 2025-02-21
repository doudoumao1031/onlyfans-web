"use client"
import Link from "next/link"
import { Attachment, FileType, TPost } from "./types"
import { buildImageUrl } from "@/lib/utils"
import { VideoPreview } from "./video-preview"
import LazyImg from "@/components/common/lazy-img"
import IconWithImage from "../profile/icon"
import { User } from "@/lib"
import { usePathname } from "next/navigation"

export default function Media({
  data,
  post,
  user
}: {
  data: Attachment[]
  post: TPost
  user: User
}) {
  const showIds = data.map((v) => v.file_id).join("_")
  const path = usePathname()
  const content = (
    <div
      className="w-full h-full bg-black bg-opacity-[30%] rounded-lg backdrop-blur absolute top-0 left-0 z-20 flex flex-col items-center justify-center"
    >
      <IconWithImage
        url="/icons/icon_info_lock_white.png"
        width={32}
        color="#fff"
        height={32}
      />
      <span
        className="mt-2 text-white"
      >{post.visibility === 2 ? "付费内容，请付费后查看" : "订阅内容，请订阅后查看"}</span>
    </div>
  )
  return (
    <>
      {/*订阅查看并且未订阅 或者 付费观看*/}
      {((post.visibility === 1 && !user.sub) || post.visibility === 2) && (
        <div className="w-full h-[200px] relative">
          {/*帖子详情正常查看 ｜ 推荐/空间点击媒体到帖子详情*/}
          {path.startsWith("/postInfo") && content}
          {!path.startsWith("/postInfo") && !user.sub && (
            <Link href={`/postInfo/${post.id}`}>
              {content}
            </Link>
          )}
          <LazyImg
            className={"aspect-square rounded-md block"}
            src={"/icons/default/img_media_default.png"}
            alt=""
            style={{
              width: "100%",
              height: "200px"
            }}
            width={343}
            height={200}
          />
        </div>
      )}
      {(post.visibility === 0 || (post.visibility === 1 && user.sub)) && (
        <div className="grid grid-cols-3 gap-2 relative">
          {data.map(({ file_id, file_type, thumb_id }, i) => {
            const toDetail = !path.startsWith("/postInfo") && ((user.sub_price > 0 && !user.following) || (user.sub_price === 0 && !user.sub))
            /*订阅需要付费 && 帖子无需付费 => 只需要关注则可查看 */
            return (
              <Link
                key={i}
                href={toDetail ? `/postInfo/${post.id}` : `/media/${file_type === FileType.Video
                  ? "video" : "image"}/${file_type === FileType.Video
                  ? showIds : showIds + "_" + i
                }`}
                className={file_type === FileType.Video ? "col-span-3" : "block"}
              >
                {file_type === FileType.Video ? (
                  <VideoPreview fileId={file_id} thumbId={thumb_id}/>
                ) : (
                  <LazyImg
                    className="aspect-square rounded-md "
                    src={buildImageUrl(file_id)}
                    alt=""
                    width={200}
                    height={200}
                  />
                )}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
