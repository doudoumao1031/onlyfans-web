import { Modal } from "@/components/common/modal"
import VideoPlay from "@/components/common/video-play"
// import { VideoPlayer } from "@/components/video/video-player"
import { addFilePlayLog } from "@/lib"
import { buildVideoUrl } from "@/lib/utils"

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
      <div className="max-w-screen relative max-h-screen">
        <VideoPlay src={buildVideoUrl(fileId, "1080p")} />
        {/* <VideoPlayer
          sources={videoSources}
          className="max-h-[100vh]"
        /> */}
      </div>
    </Modal>
  )
}
