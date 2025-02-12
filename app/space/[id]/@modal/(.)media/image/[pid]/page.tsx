import { Modal } from "@/components/common/modal"
import Carousel from "@/components/ui/carousel"
export default async function ImageBrowseModal({ params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params
  const imgIds = pid ? pid.split("_") : []
  const index = imgIds.pop()
  return (
    <Modal>
      <Carousel ids={imgIds} startIndex={Number(index)}></Carousel>
    </Modal>
  )
}
