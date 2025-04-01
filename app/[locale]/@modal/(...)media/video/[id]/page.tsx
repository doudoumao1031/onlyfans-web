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
  const videoSource = [
    // { src: buildVideoUrl(fileId, "original"), type: "video/mp4", label: "original", res: "original" },
    { src: buildVideoUrl(fileId, "240p"), type: "video/mp4", label: "240p", res: 240 },
    { src: buildVideoUrl(fileId, "480p"), type: "video/mp4", label: "480p", res: 480 },
    { src: buildVideoUrl(fileId, "720p"), type: "video/mp4", label: "720p", res: 720 },
    { src:buildVideoUrl(fileId, "1080p") , type: "video/mp4", label: "1080p", res: 1080 }
  ]

  return (
    <Modal>
      <div className="max-w-screen relative max-h-screen">
        <VideoPlay sources={videoSource} />
        {/* <VideoPlayer
          sources={videoSources}
          className="max-h-[100vh]"
        /> */}
      </div>
    </Modal>
  )
}
