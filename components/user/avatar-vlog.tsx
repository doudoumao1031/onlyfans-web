import { useTranslations } from "next-intl"

import Image from "next/image"


import CommonAvatar from "@/components/common/common-avatar"
import { User } from "@/lib"

export default function AvatarVlog({ user }: {
  user: User
}) {
  const t = useTranslations("Explore")
  return (
    <div className={"relative"}>
      <div className={"size-[88px] rounded-full border-2 border-white"}>
        <CommonAvatar photoFileId={user.photo} size={84} />
      </div>
      {!user.sub && (
        <div className="absolute left-0 top-0 rounded-full bg-black bg-opacity-40 px-2.5 leading-[18px] text-white">
          <span className="text-nowrap text-[10px] font-medium">{user.sub_price > 0 ? t("recommended.subscription") : t("recommended.free")}</span>
        </div>
      )}
      {user.live_certification && (
        <div
          className="absolute bottom-0 right-0 flex size-[24px] items-center justify-center rounded-full bg-white"
        >
          <Image src="/icons/explore/icon_sign_gamevlog@3x.png" alt="gamevlog"
            width={16}
            height={16}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  )
}