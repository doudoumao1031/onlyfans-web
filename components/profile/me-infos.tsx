import { getTranslations } from "next-intl/server"

import Avatar from "@/components/profile/avatar"
import FoldingDescription from "@/components/profile/folding-description"
import IconWithImage from "@/components/profile/icon"
import RechargePanel from "@/components/profile/recharge-panel"
import { Link } from "@/i18n/routing"
import { userWallet } from "@/lib"
import { userProfile } from "@/lib/actions/profile"

import ProfileHeader from "./profile-header"

const displayNumber = (data: number) => {
  if (data > -1 && data < 10000) {
    return data
  }
  if (data > 9999 && data < 100000) {
    return Math.ceil(data / 10000) + "W"
  }
  return Math.ceil(data / 100000) + "W+"
}

export default async function Page() {
  const t = await getTranslations("Profile")
  const response = await userProfile()
  const data = response?.data
  if (!data) {
    throw new Error()
  }
  const wallet = await userWallet()
  const walletInfo = wallet?.data
  if (!walletInfo) {
    throw new Error()
  }

  return (
    <div>
      <ProfileHeader data={data} />
      <section className="relative bg-white text-black">
        <section className="px-4 pb-3">
          <div className={"flex justify-between"}>
            <div className={"relative top-[-24px]"}>
              <Avatar showLive={data.live_certification} fileId={data.photo} />
              <h1 className="flex items-center gap-2 text-[18px] font-bold">
                <span>
                  {data.first_name}
                </span>
                <Link href={"/profile/edit"}>
                  <IconWithImage
                    url={"/theme/icon_edit_gray@3x.png"}
                    width={20}
                    height={20}
                    color={"#6D7781"}
                  />
                </Link>
              </h1>
              <div className="text-text-desc text-xs">
                {data.username
                  ? "@" + data.username
                  : !data.first_name && !data.about ? t("noUserName") : ""}
              </div>
            </div>
            <Link href={`/space/${data.id}/feed`}>
              <div className="mt-2.5 flex justify-center">
                <button className=" border-border-theme text-text-theme shrink-0 rounded-2xl border px-8 py-1">
                  {t("actions.enter")}
                </button>
              </div>
            </Link>
          </div>
          <div className="mt-[-14px] text-[14px]">
            <FoldingDescription about={data.about} location={data.location} />
          </div>
        </section>
        <div className="border-y border-[#ddd] px-4 py-2.5">
          <div className="grid grid-cols-4 text-center">
            <div className="border-r border-b-[#ddd]">
              <div className="text-[20px]">{displayNumber(data.post_count)}</div>
              <div className="text-text-desc text-xs font-light">{t("moduleTypes.post")}</div>
            </div>
            <div className="border-r border-b-[#ddd]">
              <div className="text-[20px]">{displayNumber(data.media_count)}</div>
              <div className="text-text-desc text-xs font-light">{t("moduleTypes.media")}</div>
            </div>
            <div className="border-r border-b-[#ddd]">
              <div className="text-[20px]">{displayNumber(data.fans_count)}</div>
              <div className="text-text-desc text-xs font-light">{t("moduleTypes.fans")}</div>
            </div>
            <div>
              <div className="text-[20px]">{displayNumber(data.subscribe_count)}</div>
              <div className="text-text-desc text-xs font-light">{t("moduleTypes.subscribe")}</div>
            </div>
          </div>
        </div>
        <RechargePanel walletInfo={walletInfo} />

        <div className="px-4">
          <div className="flex items-center justify-between py-2.5">
            <h3 className="text-[15px] font-bold">{t("favorites.title")}</h3>
            <Link href={"/profile/collect/posts"} className="text-gray-300">
              <IconWithImage
                url={"/theme/icon_arrow_right_gray@3x.png"}
                width={16}
                height={16}
                color={"#ddd"}
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={"/profile/collect/blogger"}
              className="rounded-xl bg-[url('/theme/bg_collect_blogger@3x.png')] bg-cover pl-4 pt-1.5"
            >
              <div className="text-xs text-[rgba(34,34,34,0.70)]">{t("favorites.blogger")}</div>
              <div className="text-[34px] font-medium text-[#2b2b2b] ">
                {data.collection_user_count}
              </div>
            </Link>
            <Link
              href={"/profile/collect/posts"}
              className="rounded-xl bg-[url('/theme/bg_collect_posts@3x.png')] bg-cover pl-4 pt-1.5"
            >
              <div className="text-xs text-[rgba(34,34,34,0.70)]">{t("favorites.posts")}</div>
              <div className="text-[34px] font-medium text-[#2b2b2b] ">
                {data.collection_post_count}
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
