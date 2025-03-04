import Image from "next/image"
import IconWithImage from "@/components/profile/icon"
import { buildImageUrl, commonUploadFile } from "@/lib/utils"
import LazyImg from "../common/lazy-img"

export default function Avatar({
  showEdit,
  showLive,
  fileId,
  onAvatarChange
}: {
  showEdit?: boolean
  showLive?: boolean
  fileId: string
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
    <div className="absolute rounded-full p-0.5 bg-white w-[90px] h-[90px] top-[-47px] left-[50%] ml-[-45px] ">
      <section className="w-full h-full relative rounded-full">
        <LazyImg
          src={fileId ? buildImageUrl(fileId) : "/icons/icon_fansX_head.png"}
          alt=""
          className="rounded-full w-full h-full"
          width={90}
          height={90}
        />
        {showLive && (
          <div className="absolute right-0 bottom-2 rounded-full p-1.5 bg-white">
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
          <div className="absolute rounded-bl-full rounded-br-full left-0 bottom-0 h-[40px] w-full bg-[rgba(0,0,0,0.5)] text-white flex items-center justify-center">
            <IconWithImage url="/theme/icon_camera@3x.png" width={24} height={24} />
            <input
              type="file"
              accept="image/*"
              multiple={false}
              className="w-full h-full opacity-0 z-10 absolute"
              onChange={(event) => {
                if (event.target.files?.length) {
                  handleUploadFile(event.target.files[0])
                  event.target.value = ""
                }
              }}
            />
          </div>
        )}
      </section>
    </div>
  )
}
