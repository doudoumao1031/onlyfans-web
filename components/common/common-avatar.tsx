"use client"
import { useMemo, useState } from "react"

import Image from "next/image"

import { Skeleton } from "@/components/ui/skeleton"
import { buildImageUrl } from "@/lib/utils"


export type CommonAvatarProps = {
  photoFileId?: string,
  src?: string,
  size?: number
}

type LazyAvatarProps = {
  size: number,
  src: string
}

function LazyAvatar(props: LazyAvatarProps) {
  const { size, src } = props
  const [loading, setIsLoading] = useState<boolean>(true)
  return (
    <div className="relative inline-flex" style={{
      width: size,
      height: size
    }}
    >
      {loading && <Skeleton className={"absolute size-full rounded-full"}></Skeleton>}
      {src && (
        <Image src={src} width={size} height={size} onLoad={() => {
          setIsLoading(false)
        }} alt={"avatar"} className={"rounded-full"}
        />
      )}
    </div>
  )
}

/**
 * 懒加载头像
 * @param props
 * @constructor
 */
export default function CommonAvatar(props: CommonAvatarProps) {
  const { photoFileId, src, size = 24 } = props
  const lazyImageSrc = useMemo(() => {
    if (src) return src
    if (photoFileId)
      return buildImageUrl(photoFileId)
  }, [photoFileId, src])

  return lazyImageSrc ? <LazyAvatar src={lazyImageSrc} size={size} /> : <Image className="rounded-full" src={"/icons/icon_fansX_head.png"} alt={""} width={size} height={size} color={"#f00"} />
}