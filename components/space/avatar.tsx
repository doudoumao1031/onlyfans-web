import Image from "next/image"

export default function Avatar() {
  return (
    <div className="absolute left-[50%] top-[-47px] ml-[-45px] size-[90px] rounded-full bg-white p-0.5">
      <Image
        src="/demo/avtar1.jpeg"
        alt="User avatar"
        width={90}
        height={90}
        className="size-full rounded-full object-cover"
        priority
      />
      <div className="absolute bottom-2 right-0 rounded-full bg-white p-1.5">
        <Image
          src="/theme/icon_sign_gamevlog@3x.png"
          width={20}
          height={20}
          alt="live"
          className="rounded-full"
        />
      </div>
    </div>
  )
}
