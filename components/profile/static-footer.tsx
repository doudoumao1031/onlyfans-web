import { getTranslations } from "next-intl/server"

import Image from "next/image"


import IconWithImage from "@/components/profile/icon"
import { Link } from "@/i18n/routing"

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
            <Link key={item.labelKey} href={item.href} className="flex items-center justify-center gap-2 text-[17px]">
              <div>
                <Image
                  src={item.iconURL}
                  alt="subscription-management"
                  width={40}
                  height={40}
                />
              </div>
              <div className={"flex flex-1 items-center justify-between border-b border-[#ddd] py-5 font-medium"}>
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
