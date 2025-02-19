import { useMemo, useState } from "react"
import { buildImageUrl } from "@/lib/utils"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"


export type CommonAvatarProps = {
  photoFileId?: string,
  src?: string,
  size?: number
}

type LazyAvatarProps = {
  size: number,
  src: string
}

function LazyAvatar (props:LazyAvatarProps) {
  const { size,src } = props
  const [loading,setIsLoading] = useState<boolean>(true)
  return (
    <div className="inline-flex relative" style={{
      width: size,
      height: size
    }}
    >
      {loading && <Skeleton className={"w-full h-full absolute rounded-full"}></Skeleton>}
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
  const { photoFileId, src ,size = 24 } = props
  const lazyImageSrc = useMemo(() => {
    if (src) return src
    if (photoFileId)
      return buildImageUrl(photoFileId)
  }, [photoFileId, src])

  return lazyImageSrc ? <LazyAvatar src={lazyImageSrc} size={size}/> : <img className="rounded-full" src={"/icons/icon_fansX_head.png"} alt={""} width={size} color={"#f00"}/>
}