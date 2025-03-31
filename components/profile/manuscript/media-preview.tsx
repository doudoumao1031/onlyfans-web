import React, { useMemo } from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VideoPlayer } from "@/components/video/video-player"
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


export function MediaPreview(props: MediaPreviewProps) {
  const { openState, setOpenState, media, mediaType, previewType, fileId } = props

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
        return buildVideoUrl(fileId, "480p")
      }
      return null
    }
    return null
  }, [fileId, media, mediaType, previewType])
  const videoSources = useMemo(() => {
    if (fileId) {
      return [
        { quality: "1080p", url: buildVideoUrl(fileId, "1080p") },
        { quality: "720p", url: buildVideoUrl(fileId, "720p") },
        { quality: "480p", url: buildVideoUrl(fileId, "480p") },
        { quality: "240p", url: buildVideoUrl(fileId, "240p") }
      ]
    }
    return []
  }, [fileId])
  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogContent className={"hide-modal-close border-none bg-transparent"}>
        <div className={"mx-auto w-10/12"}>
          {mediaUrl && mediaType === FileType.Image && (<img className={"w-full"} src={mediaUrl} alt="" width={100} height={100} />)}
          {
            previewType === PreviewType.ONLINE && mediaUrl && mediaType === FileType.Video && (
              <VideoPlayer
                sources={videoSources}
                className="max-h-screen"
              />
            )
          }
          {/*本地*/}
          {
            previewType === PreviewType.LOCAL && mediaUrl && mediaType === FileType.Video && (
              <video className={"w-full"} src={mediaUrl} controls muted autoPlay width={100} height={100}></video>
            )
          }
        </div>
        <DialogHeader className={"hidden"}>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}