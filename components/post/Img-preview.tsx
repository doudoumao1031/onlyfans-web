"use client"
import { useEffect, useState } from "react"

import { Attachment } from "@/lib"
import { buildImageUrl } from "@/lib/utils"

import LazyImg from "../common/lazy-img"

export type TProps = {
  data: Attachment[]
  file_id: string
}

export default function Page({ data, file_id }: TProps) {
  const [isVertical, setIsVertical] = useState(true)

  useEffect(() => {
    const img = new Image()
    img.src = buildImageUrl(file_id)
    img.onload = () => {
      setIsVertical(img.naturalHeight > img.naturalWidth)
    }
  }, [file_id])

  return (
    <div className="relative flex justify-center overflow-hidden">
      {data.length === 1 && isVertical && (
        <div className="absolute left-0 top-0 size-full">
          <LazyImg
            className="z-[-1] aspect-square size-full object-cover blur-[10px]"
            src={buildImageUrl(file_id)}
            alt=""
            width={200}
            height={200}
          />
        </div>
      )}
      <LazyImg
        className={`relative z-10 ${isVertical&&"aspect-square "} w-full ${
          data.length === 1 ? "object-contain" : "object-cover"
        }`}
        src={buildImageUrl(file_id)}
        alt=""
        width={200}
        height={200}
        layout="intrinsic"
      />
    </div>
  )
}