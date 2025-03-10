import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { useMemo } from "react"
import { FileType } from "@/lib"
import { buildImageUrl, buildVideoUrl } from "@/lib/utils"

export enum PreviewType {
  LOCAL = 0,
  ONLINE = 1,
}

export interface MediaPreviewProps {
  mediaType?: FileType
  openState: boolean
  setOpenState: (open: boolean) => void,
  media?: File | null
  fileId?: string
  previewType: PreviewType
}


export function MediaPreview (props:MediaPreviewProps) {
  const { openState, setOpenState ,media,mediaType,previewType ,fileId } = props

  const mediaUrl = useMemo(() => {
    if (previewType === PreviewType.LOCAL) {
      if (!media) return null
      return URL.createObjectURL(media)
    }
    if (previewType === PreviewType.ONLINE && fileId) {
      if (mediaType === FileType.Image) {
        return buildImageUrl(fileId)
      }
      if (mediaType === FileType.Video) {
        return  buildVideoUrl(fileId,"480p")
      }
      return null
    }
    return null
  },[fileId, media, mediaType, previewType])

  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogContent className={"hide-modal-close border-none bg-transparent"}>
        <div className={"w-[270px] ml-auto mr-auto"}>
          {mediaUrl && mediaType === FileType.Image && (<img className={"w-full"} src={mediaUrl} alt="" width={100} height={100}/>)}
          {mediaUrl && mediaType === FileType.Video && (<video className={"w-full"} src={mediaUrl} autoPlay width={100} height={100}></video>)}
        </div>
        <DialogHeader className={"hidden"}>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}