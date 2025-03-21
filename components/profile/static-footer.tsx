import { Link } from "@/i18n/routing"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import IconWithImage from "@/components/profile/icon"

const LINKS_CONFIG = [
  {
    labelKey: "subscribe",
    iconURL: "/theme/icon_fans_mine_subscription@3x.png",
    href: "/profile/order"
  },
  {
    labelKey: "draft",
    iconURL: "/theme/icon_fans_mine_manuscript@3x.png",
    href: "/profile/manuscript"
  },
  {
    labelKey: "fans",
    iconURL: "/theme/icon_fans_mine_fans@3x.png",
    href: "/profile/fans/manage/subscribe"
  },
  {
    labelKey: "income",
    iconURL: "/theme/icon_fans_mine_income@3x.png",
    href: "/profile/incomeView"
  },
  {
    labelKey: "data",
    iconURL: "/theme/icon_fans_mine_record@3x.png",
    href: "/profile/dataCenter/dataView"
  }
]

export default async function Page() {
  const t = await getTranslations("Profile.management")
  return (
    <div className="px-4 pb-8">
      <div className="mt-5 ">
        <div className="">
          {LINKS_CONFIG.map((item) => (
            <Link key={item.labelKey} href={item.href} className="flex justify-center items-center gap-2 text-[17px]">
              <div>
                <Image
                  src={item.iconURL}
                  alt="subscription-management"
                  width={40}
                  height={40}
                />
              </div>
              <div className={"flex-1 py-5 flex justify-between font-medium border-b border-[#ddd] items-center"}>
                <div>{t(item.labelKey)}</div>
                <IconWithImage
                  url={"/theme/icon_arrow_right_gray@3x.png"}
                  width={16}
                  height={16}
                  color={"#9c949c"}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
