import { Modal } from "@/components/common/modal"
import { buildVideoUrl } from "@/lib/utils"

export default async function VideoBrowseModal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Modal>
      <div className="relative aspect-video w-full max-w-[100vw]">
        <video
          className="size-full"
          controls
          autoPlay
          src={buildVideoUrl(id, "1080p")}
        />
      </div>
    </Modal>
  )
}
