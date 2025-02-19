import IconWithImage from "@/components/profile/icon"
import { SubscribeUserInfo } from "@/lib"
import dayjs from "dayjs"
import CommonAvatar from "@/components/common/common-avatar"


const showTime = (startTime: number) => {
  const diff = dayjs(startTime * 1000).diff(dayjs(), "months")
  if (diff === 0) {
    return "最近关注"
  }
  return `${diff}个月`
}

export default function FansListItem({ isSubscribe, data }: {
  isSubscribe?: boolean,
  data: SubscribeUserInfo
}) {
  return (
    <div className={"flex gap-4 items-center"}>
      <div className={" shrink-0"}>
        <CommonAvatar photoFileId={data.user.photo} size={40}/>
      </div>
      <div className={"flex-1 flex justify-between border-b border-[#ddd] py-3 "}>
        <button className={"text-left"}>
          <div className={"text-base text-[#222] font-medium"}>{data.user.username}</div>
          <div
            className={"text-xs text-[#bbb]"}
          >{isSubscribe ? showTime(data.start_time) : dayjs(data.start_time).format("YYYY-MM-DD HH:mm")}</div>
        </button>
        {isSubscribe && (
          <button className={"shrink-0"}>
            <IconWithImage url={"/icons/profile/icon_chat_gray@3x.png"} width={24} height={24} color={"#777"}/>
          </button>
        )}
      </div>
    </div>
  )
}