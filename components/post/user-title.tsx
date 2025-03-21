import dayjs from "dayjs"

import CommonAvatar from "@/components/common/common-avatar"
import { Link } from "@/i18n/routing"
import { User } from "@/lib"
import { ZH_MM_DD_HH_mm } from "@/lib/constant"

import { buildMention } from "./utils"
import IconWithImage from "../profile/icon"

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
          <div className="flex shrink-0 items-center">
            <CommonAvatar photoFileId={photo} size={40} />
          </div>
          <div>
            <div className="max-w-[150px] truncate text-base">
              {first_name} {last_name}
            </div>
            <div className="text-xs text-black/50">{buildMention(username)}</div>
          </div>
        </div>
      </Link>
      <div className={"mr-2 mt-1"}>
        {(pinned && space) ? (
          <IconWithImage
            url={"/icons/icon_fans_stick_gray@3x.png"}
            height={20}
            width={20}
            color={"#777"}
          />
        ) : (
          <span className="text-nowrap">{dayjs(pub_time * 1000).format(ZH_MM_DD_HH_mm)}</span>
        )}
      </div>
    </div>
  )
}
