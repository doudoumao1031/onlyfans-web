import { useTranslations } from "next-intl"

import Image from "next/image"


import AvatarVlog from "@/components/user/avatar-vlog"
import { Link } from "@/i18n/routing"
import { User } from "@/lib/actions/users/types"
import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"

import { buildMention } from "./utils"

export default function Subscribe({ user }: { user: User }) {
  const { back_img, photo, id, first_name, last_name, username, sub, sub_price } = user
  const t = useTranslations("Explore")
  const content = (
    <div className="flex h-[100px] w-full justify-center rounded-lg bg-black">
      <Image
        src={back_img ? buildImageUrl(back_img) : getUserDefaultBackImg(username)}
        alt="Background"
        width={280}
        height={100}
        className="w-full rounded-lg object-cover"
      />
      <div className="absolute flex size-full justify-between rounded-lg bg-black/50 p-4">
        <div className="flex items-center gap-3 px-0">
          <div>
            <AvatarVlog user={user} />
          </div>
          <div className="text-white">
            <div className="max-w-[160px] truncate text-sm">
              {first_name} {last_name}
            </div>
            <div className="text-xs text-white/75">{buildMention(username)}</div>
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
          <div className="self-start rounded-full bg-black bg-opacity-40 px-4 py-1 text-white">
            <span className="text-nowrap text-xs">{sub ? t("recommended.subscribed") : sub_price > 0 ? t("recommended.freeAndSubscription") : t("recommended.free")}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
