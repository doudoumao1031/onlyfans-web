import { Modal } from "@/components/common/modal"
import { VideoPlayer } from "@/components/video/video-player"
import { addFilePlayLog } from "@/lib"
import VideoPlay from "@/components/common/video-play"

export default async function VideoBrowseModal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [fileId, postId] = id ? id.split("_") : []
  if (fileId && postId) {
    await addFilePlayLog(Number(postId), fileId)
  }
  // Create video sources for different qualities
  const videoSources = [
    { quality: "1080p", url: buildVideoUrl(fileId, "1080p") },
    { quality: "720p", url: buildVideoUrl(fileId, "720p") },
    { quality: "480p", url: buildVideoUrl(fileId, "480p") },
    { quality: "240p", url: buildVideoUrl(fileId, "240p") }
  ]

  return (
    <Modal>
      <div className="relative max-w-[100vw] max-h-[100vh]">
        <VideoPlay src={buildVideoUrl(fileId, "1080p")} />
        {/* <VideoPlayer
          sources={videoSources}
          className="max-h-[100vh]"
        /> */}
      </div>
    </Modal>
  )
}
