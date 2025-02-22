import { User } from "@/lib"
import { buildMention } from "./utils"
import dayjs from "dayjs"
import CommonAvatar from "@/components/common/common-avatar"
import IconWithImage from "../profile/icon"
import Link from "next/link"

export default function UserTitle({
  user,
  pub_time,
  pinned
}: {
  user: User
  pub_time: number
  pinned: boolean
}) {
  const { photo, first_name, last_name, username } = user
  return (
    <div className={"flex justify-between"}>
      <Link href={`/space/${user.id}/feed`}>
        <div className="flex gap-4 ">
          <div className="flex items-center">
            <CommonAvatar photoFileId={photo} size={40} />
          </div>
          <div>
            <div className="text-lg">
              {first_name} {last_name}
            </div>
            <div className="text-black/50 text-xs">{buildMention(username)}</div>
          </div>
        </div>
      </Link>
      <div className={"mt-1 mr-2"}>
        {!pinned ? (
          <span>{dayjs(pub_time * 1000).format("MM-DD HH:mm")}</span>
        ) : (
          <IconWithImage
            url={"/icons/icon_fans_stick_gray@3x.png"}
            height={20}
            width={20}
            color={"#777"}
          />
        )}
      </div>
    </div>
  )
}
