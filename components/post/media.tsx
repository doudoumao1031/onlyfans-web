import Link from "next/link"
import Image from "next/image"
import { Attachment, FileType, TPost } from "./types"
import { buildImageUrl } from "@/lib/utils"
import { VideoPreview } from "./video-preview"
import LazyImg from "@/components/common/lazy-img"
import IconWithImage from "../profile/icon"
import { User } from "@/lib"

export default function Media({
  data,
  post,
  user,
  id
}: {
  data: Attachment[]
  post: TPost
  user: User
  id: string | undefined
}) {
  const showIds = data.map((v) => v.file_id).join("_")
  return (
    <div className="grid grid-cols-3 gap-2 relative">
      {post.visibility === 1 && !user.sub && (
        <div className="w-full h-full bg-black bg-opacity-5 rounded-lg backdrop-blur absolute top-0 left-0 z-[99] flex flex-col items-center justify-center">
          <IconWithImage
            url="/icons/icon_info_lock_white.png"
            width={32}
            color="#fff"
            height={32}
          />
          <span className="mt-2 text-white">订阅内容，请订阅后查看</span>
        </div>
      )}
      {data.map(({ file_id, file_type, thumb_id }, i) => {
        return (
          <Link
            key={i}
            href={`${id ? "/space/" + id : ""}/media/${
              file_type === FileType.Video ? "video" : "image"
            }/${file_type === FileType.Video ? showIds : showIds + "_" + i}`}
            className={file_type === FileType.Video ? "col-span-3" : "block"}
          >
            {file_type === FileType.Video ? (
              <VideoPreview fileId={file_id} thumbId={thumb_id} />
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
  )
}
