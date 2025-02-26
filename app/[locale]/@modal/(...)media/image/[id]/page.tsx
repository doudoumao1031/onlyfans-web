import { Modal } from "@/components/common/modal"
import Carousel from "@/components/ui/carousel"
export default async function ImageBrowseModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const imgIds = id ? id.split("_") : []
  const index = imgIds.pop()
  return (
    <Modal>
      <Carousel ids={imgIds} startIndex={Number(index)}></Carousel>
    </Modal>
  )
}
