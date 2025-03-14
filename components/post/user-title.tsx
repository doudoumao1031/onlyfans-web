import { User } from "@/lib"
import { buildMention } from "./utils"
import dayjs from "dayjs"
import CommonAvatar from "@/components/common/common-avatar"
import IconWithImage from "../profile/icon"
import { Link } from "@/i18n/routing"

export default function UserTitle({
  user,
  pub_time,
  pinned,
  space
}: {
  user: User
  pub_time: number
  pinned: boolean
  space?: boolean // 是否空间，置顶图标
}) {
  const { photo, first_name, last_name, username } = user
  return (
    <div className={"flex justify-between"}>
      <Link href={`/space/${user.id}/feed`}>
        <div className="flex gap-4">
          <div className="flex items-center shrink-0">
            <CommonAvatar photoFileId={photo} size={40} />
          </div>
          <div>
            <div className="text-base truncate max-w-[150px]">
              {first_name} {last_name}
            </div>
            <div className="text-black/50 text-xs">{buildMention(username)}</div>
          </div>
        </div>
      </Link>
      <div className={"mt-1 mr-2"}>
        {(pinned && space) ? (
          <IconWithImage
            url={"/icons/icon_fans_stick_gray@3x.png"}
            height={20}
            width={20}
            color={"#777"}
          />
        ) : (
          <span className="text-nowrap">{dayjs(pub_time * 1000).format("MM-DD HH:mm")}</span>
        )}
      </div>
    </div>
  )
}
