import EmblaCarousel from "@/components/common/embla-carousel"
import { Modal } from "@/components/common/modal"

export default async function ImageBrowseModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const imgIds = id ? id.split("_") : []
  const index = imgIds.pop()
  return (
    <Modal>
      <EmblaCarousel ids={imgIds} startIndex={Number(index)}></EmblaCarousel>
    </Modal>
  )
}
