import Image from "next/image"
import LazyImg from "../common/lazy-img"
import CommonAvatar from "@/components/common/common-avatar"

export default function Avatar({ src, vlog = false }: {
  src?: string,
  vlog?: boolean
}) {
  return (
    <div className={"relative"}>
      <div className={"w-[66px] h-[66px] rounded-full border-2 border-white"}>
        <CommonAvatar photoFileId={src} size={62}/>
      </div>
      {vlog && (
        <div
          className="absolute rounded-full bottom-0 right-0 w-[24px] h-[24px] bg-white flex justify-center items-center"
        >
          <Image src="/icons/explore/icon_sign_gamevlog@3x.png" alt="gamevlog"
            width={16}
            height={16}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  )
}