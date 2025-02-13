import Link from "next/link"
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
    <>
      {((post.visibility === 1 && !user.sub) || post.visibility === 2) && (
        <div className="w-full h-[200px] relative">
          <div
            className="w-full h-full bg-black bg-opacity-[30%] rounded-lg backdrop-blur absolute top-0 left-0 z-[99] flex flex-col items-center justify-center"
          >
            <IconWithImage
              url="/icons/icon_info_lock_white.png"
              width={32}
              color="#fff"
              height={32}
            />
            <span className="mt-2 text-white">订阅内容，请订阅后查看</span>
          </div>
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
            return (
              <Link
                key={i}
                href={`/media/${file_type === FileType.Video ? "video" : "image"}/${
                  file_type === FileType.Video ? showIds : showIds + "_" + i
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
