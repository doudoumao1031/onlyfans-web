import Image from "next/image"
import IconWithImage from "@/components/profile/icon"

export interface IFansListItem {
    name: string
    id: string
    avatar: string
}

export default function FansListItem({ isSubscribe }: {
    isSubscribe?: boolean,
    data?: IFansListItem
}) {
  return (
    <div className={"flex gap-4 items-center"}>
      <Image src={"/demo/1076-40x40.jpg"} alt={"avatar"} width={40} height={40} className={"rounded-full shrink-0"}/>
      <div className={"flex-1 flex justify-between border-b border-[#ddd] py-3 "}>
        <button className={"text-left"}>
          <div className={"text-base text-[#222] font-medium"}>Lakshmana Dongerkerry</div>
          <div className={"text-xs text-[#bbb]"}>{isSubscribe ? "99个月" : "2020-02-02"}</div>
        </button>
        {isSubscribe && (
          <button className={"shrink-0"}>
            <IconWithImage url={"/icons/profile/icon_chat@3x.png"} width={24} height={24} color={"#777"}/>
          </button>
        )}
      </div>
    </div>
  )
}