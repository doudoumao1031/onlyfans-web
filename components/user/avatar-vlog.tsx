import Image from "next/image"
import CommonAvatar from "@/components/common/common-avatar"
import { useTranslations } from "next-intl"
import { User } from "@/lib"

export default function AvatarVlog({ user }: {
  user: User
}) {
  const t = useTranslations("Explore")
  return (
    <div className={"relative"}>
      <div className={"w-[88px] h-[88px] rounded-full border-2 border-white"}>
        <CommonAvatar photoFileId={user.photo} size={84} />
      </div>
      {!user.sub && (
        <div className="absolute bg-black bg-opacity-40 px-2.5 pb-[3px] rounded-full text-white top-0 left-0">
          <span className="text-[10px] text-nowrap font-medium">{user.sub_price > 0 ? t("recommended.subscription") : t("recommended.free")}</span>
        </div>
      )}
      {user.live_certification && (
        <div
          className="absolute rounded-full bottom-0 right-0 w-[24px] h-[24px] bg-white flex justify-center items-center"
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