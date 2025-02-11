import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"
import { User } from "@/lib/actions/users/types"
import Avatar from "./avatar"
import Image from "next/image"
import Link from "next/link"
import { buildMention } from "./utils"
import SubscribedButton from "@/components/explore/subscribed-button"

export default function Subscribe({ user }: { user: User }) {
  const { back_img, photo, id, first_name, last_name, username, sub_price, sub } = user

  const content = (
    <div
      className="flex justify-center w-full bg-black rounded-lg h-[100px]"
      style={{
        backgroundImage: `url(${buildImageUrl(back_img)})`
      }}
    >
      <Image
        src={back_img ? buildImageUrl(back_img) : getUserDefaultBackImg(username)}
        width={280}
        height={100}
        alt="Background"
      />
      <div className="w-full h-full absolute flex justify-between bg-black/50 p-3 rounded-lg">
        <div className="flex gap-4 px-3 items-center">
          <div>
            <Avatar fileId={photo} width={24}/>
          </div>
          <div className="text-white">
            <div className="text-lg">
              {first_name} {last_name}
            </div>
            <div className="text-white/75 text-xs">{buildMention(username)}</div>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <div className="relative">
      <Link href={`/space/${id}/feed`}>
        {content}
      </Link>
      {!sub && (
        <div className="absolute right-4 bottom-4 z-10">
          <SubscribedButton name={first_name} userId={Number(id)} subPrice={sub_price} type={"button"}/>
        </div>
      )}
    </div>
  )
}
