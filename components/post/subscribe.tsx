import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"
import { User } from "@/lib/actions/users/types"
import Avatar from "./avatar"
import Image from "next/image"
import Link from "next/link"
import { buildMention } from "./utils"

export default function Subscribe({ user }: { user: User }) {
  const { back_img, photo, id, first_name, last_name, username, sub } = user

  const content = (
    <div className="flex justify-center w-full bg-black rounded-lg h-[100px]">
      <Image
        src={back_img ? buildImageUrl(back_img) : getUserDefaultBackImg(username)}
        alt="Background"
        width={280}
        height={100}
        className="w-full rounded-lg"
      />
      <div className="w-full h-full absolute flex justify-between bg-black/50 p-3 rounded-lg">
        <div className="flex gap-4 px-3 items-center">
          <div>
            <Avatar fileId={photo} width={16}/>
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
        {!sub && (
          <div className="absolute right-4 top-4 z-10">
            {/*<SubscribedButton name={first_name} userId={Number(id)} subPrice={sub_price} type={"button"}/>*/}
            <div className="bg-black bg-opacity-40 self-start px-2 py-1 rounded-full text-white">
              <span className="text-xs text-nowrap">免费/订阅</span>
            </div>
          </div>
        )}
      </Link>
    </div>
  )
}
