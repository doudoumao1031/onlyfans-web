import { useMemo } from "react"
import { buildImageUrl } from "@/lib/utils"
import LazyImg from "@/components/common/lazy-img"


export type CommonAvatarProps = {
  photoFileId?: string,
  src?: string,
  size?: number
}

export default function CommonAvatar(props: CommonAvatarProps) {
  const { photoFileId, src ,size = 24 } = props

  const lazyImageSrc = useMemo(() => {
    if (src) return src
    if (photoFileId)
      return buildImageUrl(photoFileId)
  }, [photoFileId, src])

  return lazyImageSrc ? <LazyImg className={"rounded-full"} src={lazyImageSrc} alt={"avatar"} width={size} height={size}/> : <img className="rounded-full" src={"/icons/icon_fansX_head.png"} alt={""} width={size} color={"#f00"}/>
}