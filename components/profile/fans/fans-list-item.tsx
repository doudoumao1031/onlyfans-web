import IconWithImage from "@/components/profile/icon"
import { FansFollowItem, FansSubscribeItems } from "@/lib"
import dayjs from "dayjs"
import CommonAvatar from "@/components/common/common-avatar"
import { useTranslations } from "next-intl"
import { ZH_YYYY_MM_DD_HH_mm } from "@/lib/constant"
import { Link } from "@/i18n/routing"

export function FansSubscribe({ data }: {
  data: FansSubscribeItems
}) {
  const t = useTranslations("Profile.fans")
  const showTime = (endTime: number ) => {
    const diff = dayjs(endTime * 1000).diff(dayjs(), "day")
    if (diff === 0) {
      return `${t("Recent")} t("follow")}`
    }
    return `${diff}天`
  }
  return (
    <div className={"flex gap-4 items-center"}>
      <Link href={`/space/${data.user.id}/feed`} className={"shrink-0"}>
        <CommonAvatar photoFileId={data.user.photo} size={40}/>
      </Link>
      <div className={"flex-1 flex justify-between border-b border-[#ddd] py-3"}>
        <Link href={`/space/${data.user.id}/feed`} className={"text-left"}>
          <div className={"text-base text-[#222] font-medium truncate"}>{data.user.first_name}</div>
          <div className={"text-xs text-[#bbb]"}>{showTime(data.end_time)}</div>
        </Link>
        <button className={"shrink-0"}>
          <IconWithImage url={"/icons/profile/icon_chat_gray@3x.png"} width={24} height={24} color={"#777"}/>
        </button>
      </div>
    </div>
  )
}

export function FollowedListItem({ data }:{data:FansFollowItem}) {
  return (
    <Link href={`/space/${data.user.id}/feed`} className={"flex gap-4 items-center"}>
      <div className={"shrink-0"}>
        <CommonAvatar photoFileId={data.user.photo} size={40}/>
      </div>
      <div className={"flex-1 flex justify-between border-b border-[#ddd] py-3 w-full"}>
        <button className={"text-left w-[80%]"}>
          <div className={"text-base text-[#222] font-medium truncate"}>{`${data.user.first_name} ${data.user.last_name}`}</div>
          <div
            className={"text-xs text-[#bbb]"}
          >{dayjs(data.following_time * 1000).format(ZH_YYYY_MM_DD_HH_mm)}</div>
        </button>
      </div>
    </Link>
  )
}