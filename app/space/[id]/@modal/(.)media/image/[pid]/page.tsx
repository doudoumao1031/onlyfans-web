import Image from "next/image"
import { buildImageUrl } from "@/lib/utils"
import { Modal } from "@/components/common/modal"

export default async function ImageBrowseModal({ params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params
  return (
    <Modal>
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <Image
          src={buildImageUrl(pid)}
          alt=""
          width={1200}
          height={800}
          className="object-contain max-w-full max-h-[90vh]"
        />
      </div>
    </Modal>
  )
}
