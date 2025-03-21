import { buildMention } from "@/components/post/utils"
import AvatarVlog from "@/components/user/avatar-vlog"
import { Link } from "@/i18n/routing"
import { User } from "@/lib"
import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"

import LazyImg from "../common/lazy-img"
/**
 * 博主名片
 * @param user: User 用户信息
 * @constructor
 */
export default function UserCard({ user }: { user: User }) {
  const cardContent = (
    <>
      <div className="h-[116px] w-full rounded-lg bg-black">
        <LazyImg
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          src={user.back_img ? buildImageUrl(user.back_img) : getUserDefaultBackImg(user.username)}
          width={1000}
          height={116}
          alt=""
          className="w-full rounded-lg"
        />
        <div className="absolute left-0 top-[58px] h-[58px] w-full rounded-b-lg bg-black bg-opacity-20">
          <div className="ml-[115px] mt-2.5 flex flex-col justify-center text-white">
            <div className="w-[85%] truncate text-nowrap text-sm font-medium">{`${user.first_name} ${user.last_name}`}</div>
            <div className="w-[75%] truncate text-xs font-normal">{buildMention(user.username)}</div>
          </div>
        </div>
        <div className="absolute left-[15px] top-[14px]">
          <AvatarVlog user={user} />
        </div>
      </div>
    </>
  )

  return (
    <div className="relative">
      <Link href={`/space/${user.id}/feed`} className="">
        {cardContent}
      </Link>
    </div>
  )
}
