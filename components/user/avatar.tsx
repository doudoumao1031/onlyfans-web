import Image from "next/image"
import LazyImg from "../common/lazy-img"

export default function Avatar({ src, initials, vlog = false }: {
  src?: string,
  initials?: string,
  vlog?: boolean
}) {
  return (
    <div className={"relative"}>
      {src ? (
        <LazyImg
          src={src}
          alt=""
          className={"rounded-full border-2 border-white w-[66px]"}
          width={50}
          height={50}
        />
      ) : (
        <div
          className={"w-[66px] h-[66px] rounded-full border-2 border-white flex justify-center items-center text-xl"}
        >
          {initials?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
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