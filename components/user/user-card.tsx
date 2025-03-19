import { User } from "@/lib"
import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import AvatarVlog from "@/components/user/avatar-vlog"
import { buildMention } from "@/components/post/utils"
import LazyImg from "../common/lazy-img"
/**
 * 博主名片
 * @param user 用户信息
 * @param subscribe 是否订阅
 * @constructor
 */
export default function UserCard({ user }: { user: User }) {
  const cardContent = (
    <>
      <div className="w-full bg-black rounded-lg h-[116px]">
        <LazyImg
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          src={user.back_img ? buildImageUrl(user.back_img) : getUserDefaultBackImg(user.username)}
          width={1000}
          height={116}
          alt=""
          className="w-full rounded-lg"
        />
        <div className="absolute top-[58px] w-full h-[58px] rounded-b-lg left-0 bg-black bg-opacity-20">
          <div className="text-white ml-[115px] mt-2.5 flex flex-col justify-center">
            <div className="font-medium text-sm text-nowrap w-[85%] truncate">{`${user.first_name} ${user.last_name}`}</div>
            <div className="font-normal text-xs w-[75%] truncate">{buildMention(user.username)}</div>
          </div>
        </div>
        <div className="absolute top-[14px] left-[15px]">
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
