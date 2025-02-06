import { buildVideoUrl } from "@/lib/utils"
import { Modal } from "@/components/common/modal"
import { VideoPlayer } from "@/components/video/video-player"

export default async function VideoBrowseModal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Create video sources for different qualities
  const videoSources = [
    { quality: "1080p", url: buildVideoUrl(id, "1080p") },
    { quality: "720p", url: buildVideoUrl(id, "720p") },
    { quality: "480p", url: buildVideoUrl(id, "480p") },
    { quality: "240p", url: buildVideoUrl(id, "240p") }
  ]

  return (
    <Modal>
      <div className="relative max-w-[100vw] max-h-[100vh]">
        <VideoPlayer
          sources={videoSources}
          className="max-h-[100vh]"
        />
      </div>
    </Modal>
  )
}
