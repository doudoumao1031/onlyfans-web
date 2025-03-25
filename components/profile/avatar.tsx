import Image from "next/image"

import IconWithImage from "@/components/profile/icon"
import { buildImageUrl, commonUploadFile } from "@/lib/utils"

import LazyImg from "../common/lazy-img"

export default function Avatar({
  showEdit,
  showLive,
  fileId,
  size = 84,
  onAvatarChange
}: {
  showEdit?: boolean
  showLive?: boolean
  fileId: string
  size?: number
  onAvatarChange?: (fileId: string) => void
}) {
  const handleUploadFile = (file: File) => {
    commonUploadFile(file).then((res) => {
      if (res?.file_id) {
        onAvatarChange?.(res?.file_id)
      }
    })
  }
  return (
    <div className="relative rounded-full border border-gray-100 bg-white p-0.5" style={{ width: size, height: size, boxSizing: "content-box" }}>
      {showEdit && (
        <input
          type="file"
          accept="image/*"
          multiple={false}
          className="absolute z-10 size-full opacity-0"
          onChange={(event) => {
            if (event.target.files?.length) {
              handleUploadFile(event.target.files[0])
              event.target.value = ""
            }
          }}
        />
      )}
      <section className="relative size-full rounded-full">
        <LazyImg
          src={fileId ? buildImageUrl(fileId) : "/icons/icon_fansX_head.png"}
          alt=""
          className="size-full rounded-full"
          width={size}
          height={size}
        />
        {showLive && (
          <div className="absolute bottom-2 right-0 rounded-full bg-white p-1.5">
            <Image
              className="rounded-full"
              src="/theme/icon_sign_gamevlog@3x.png"
              width={20}
              height={20}
              alt="live"
            />
          </div>
        )}
        {showEdit && (
          <div className="absolute bottom-0 left-0 flex h-[40px] w-full items-center justify-center rounded-b-full bg-[rgba(0,0,0,0.5)] text-white">
            <IconWithImage url="/theme/icon_camera@3x.png" width={24} height={24} />
          </div>
        )}
      </section>
    </div>
  )
}
