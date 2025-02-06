import Image from "next/image"
import { buildImageUrl } from "@/lib/utils"
import { Modal } from "@/components/common/modal"

export default async function ImageBrowseModal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Modal>
      <div className="relative max-w-[100vw] max-h-[100vh]">
        <Image
          src={buildImageUrl(id)}
          alt=""
          width={1200}
          height={800}
          className="object-contain w-[100vw] max-h-[100vh]"
        />
      </div>
    </Modal>
  )
}
