import { buildImageUrl } from "@/lib/utils"
import Image from "next/image"

export default function Avatar({ fileId, width = 16 }: { fileId: string; width?: number }) {
  return (
    <Image
      src={buildImageUrl(fileId)}
      alt=""
      className={`rounded-full border-2 border-white w-${width} h-${width}`}
      width={50}
      height={50}
    />
  )
}
