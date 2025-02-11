import { buildImageUrl } from "@/lib/utils"
import LazyImg from "../common/lazy-img"

export default function Avatar({ fileId, width = 16 }: { fileId: string; width?: number }) {
  return (
    <div className={`w-${width}`}>
      <LazyImg
        src={buildImageUrl(fileId)}
        alt=""
        className={`rounded-full border-2 border-white w-${width} h-${width}`}
        width={66}
        height={66}
      />
    </div>
  )
}
