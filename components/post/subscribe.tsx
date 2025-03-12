import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"
import { User } from "@/lib/actions/users/types"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { buildMention } from "./utils"
import { useTranslations } from "next-intl"
import AvatarVlog from "@/components/user/avatar-vlog"

export default function Subscribe({ user }: { user: User }) {
  const { back_img, photo, id, first_name, last_name, username, sub, sub_price } = user
  const t = useTranslations("Explore")
  const content = (
    <div className="flex justify-center w-full bg-black rounded-lg h-[100px]">
      <Image
        src={back_img ? buildImageUrl(back_img) : getUserDefaultBackImg(username)}
        alt="Background"
        width={280}
        height={100}
        className="w-full rounded-lg object-cover"
      />
      <div className="w-full h-full absolute flex justify-between bg-black/50 p-4 rounded-lg">
        <div className="flex gap-3 px-0 items-center">
          <div>
            <AvatarVlog src={photo} vlog={user.live_certification} />
          </div>
          <div className="text-white">
            <div className="text-sm truncate max-w-[160px]">
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
        <div className="absolute right-2.5 top-2 z-10">
          {/*<SubscribedButton name={first_name} userId={Number(id)} subPrice={sub_price} type={"button"}/>*/}
          <div className="bg-black bg-opacity-40 self-start px-4 py-1 rounded-full text-white">
            <span className="text-xs text-nowrap">{sub ? t("recommended.subscribed") : sub_price > 0 ? t("recommended.freeAndSubscription") : t("recommended.free")}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
