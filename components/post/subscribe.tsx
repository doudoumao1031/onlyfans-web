import { buildImageUrl } from "@/lib/utils"
import { User } from "./types"
import Avatar from "./avatar"
import { buildMention } from "./utils"
import SubscribedDrawer from "../explore/subscribed-drawer"

export default function Subscribe({ user }: { user: User }) {
  const { back_img, photo, id, first_name, last_name, username } = user
  return (
    <div
      className="w-full rounded-lg bg-cover h-[100px]"
      style={{
        backgroundImage: `url(${buildImageUrl(back_img)})`
      }}
    >
      <div className="w-full h-full flex justify-between bg-black/50 p-3 rounded-lg">
        <div className="flex gap-4 px-3 items-center">
          <div>
            <Avatar fileId={photo} width={24} />
          </div>
          <div className="text-white">
            <div className="text-lg">
              {first_name} {last_name}
            </div>
            <div className="text-white/75 text-xs">{buildMention(username)}</div>
          </div>
        </div>
        <SubscribedDrawer name={first_name} userId={Number(id)} />
      </div>
    </div>
  )
}
