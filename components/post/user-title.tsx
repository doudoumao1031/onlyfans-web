import Avatar from "./avatar"
import { User } from "./types"
import { buildMention } from "./utils"

export default function UserTitle({ user }: { user: User }) {
  const { photo, first_name, last_name, username } = user
  return (
    <div className="flex gap-4 px-3">
      <div>
        <Avatar fileId={photo} />
      </div>
      <div>
        <div className="text-lg">
          {first_name} {last_name}
        </div>
        <div className="text-black/50 text-xs">{buildMention(username)}</div>
      </div>
    </div>
  )
}
