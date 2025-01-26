import Link from "next/link"
import Image from "next/image"
import { Attachment, FileType } from "./types"
import { buildImageUrl } from "@/lib/utils"
import { VideoPreview } from "./video-preview"
import LazyImg from "@/components/common/lazy-img"

export default function Media({ data }: { data: Attachment[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map(({ file_id, file_type, thumb_id }, i) => (
        <Link
          key={i}
          href={`/media/${file_type === FileType.Video ? "video" : "image"}/${file_id}`}
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
      ))}
    </div>
  )
}
