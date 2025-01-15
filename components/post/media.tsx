import Link from "next/link"
import Image from "next/image"
import { Attachment, FileType } from "./types"
import { buildImageUrl } from "@/lib/utils"

export default function Media({ data }: { data: Attachment[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map(({ file_id, file_type, thumb_id }, i) => (
        <Link
          key={i}
          href={`/media/${file_type === FileType.Video ? "video" : "image"}/${file_id}`}
          className="block"
        >
          {file_type === FileType.Video ? (
            <div
              className="aspect-square flex justify-center items-center bg-cover rounded-md"
              style={{
                backgroundImage: `url(${buildImageUrl(thumb_id || file_id)})`
              }}
            >
              <div className="bg-black/50 w-12 h-12 rounded-full flex justify-center items-center">
                <Image src="/icons/play.png" width={20} height={20} alt="play" />
              </div>
            </div>
          ) : (
            <Image
              className="aspect-square rounded-md"
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
