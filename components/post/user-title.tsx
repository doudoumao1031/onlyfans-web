import Avatar from "./avatar"
import { User } from "@/lib"
import { buildMention } from "./utils"
import dayjs from "dayjs"

export default function UserTitle({ user, pub_time }: { user: User, pub_time: number }) {
  const { photo, first_name, last_name, username } = user
  return (
    <div className={"flex justify-between"}>
      <div className="flex gap-4 px-3">
        <div>
          <Avatar fileId={photo}/>
        </div>
        <div>
          <div className="text-lg">
            {first_name} {last_name}
          </div>
          <div className="text-black/50 text-xs">{buildMention(username)}</div>
        </div>
      </div>
      <div className={"mt-1 mr-2"}>
        <span>{dayjs(pub_time * 1000).format("MM-DD HH:mm")}</span>
      </div>
    </div>
  )
}
