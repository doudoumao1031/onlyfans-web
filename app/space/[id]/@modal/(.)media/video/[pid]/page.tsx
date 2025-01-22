import { buildVideoUrl } from "@/lib/utils"
import { Modal } from "@/components/common/modal"

export default async function VideoBrowseModal({ params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params

  return (
    <Modal>
      <div className="relative w-full max-w-[90vw] aspect-video">
        <video className="w-full h-full" controls autoPlay src={buildVideoUrl(pid, "1080p")} />
      </div>
    </Modal>
  )
}
