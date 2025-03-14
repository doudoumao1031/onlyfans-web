import { Link } from "@/i18n/routing"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

export default async function Page() {
  const t = await getTranslations("Profile.management")
  return (
    <div className="px-4 pb-8">
      <div className="mt-5 ">
        <div className="grid grid-cols-3 gap-y-4 text-[#222]">
          <Link href={"/profile/order"} className="flex justify-center flex-col items-center gap-2">
            <div>
              <Image
                src="/theme/icon_fans_mine_subscription@3x.png"
                alt="subscription-management"
                width={50}
                height={50}
              />
            </div>
            <div>{t("subscribe")}</div>
          </Link>
          <Link
            href={"/profile/manuscript"}
            className="flex justify-center flex-col items-center gap-2"
          >
            <div>
              <Image
                src="/theme/icon_fans_mine_manuscript@3x.png"
                alt="icon-manuscript-management"
                width={50}
                height={50}
              />
            </div>
            <div>{t("draft")}</div>
          </Link>
          <Link
            href={"/profile/fans/manage/subscribe"}
            className="flex justify-center flex-col items-center gap-2"
          >
            <div>
              <Image
                src="/theme/icon_fans_mine_fans@3x.png"
                alt="icon-fan-management"
                width={50}
                height={50}
              />
            </div>
            <div>{t("fans")}</div>
          </Link>
          <Link
            href={"/profile/income/incomeView"}
            className="flex justify-center flex-col items-center gap-2"
          >
            <div>
              <Image
                src="/theme/icon_fans_mine_income@3x.png"
                alt="icon-revenue-center"
                width={50}
                height={50}
              />
            </div>
            <div>{t("income")}</div>
          </Link>
          <Link
            href={"/profile/dataCenter/dataView"}
            className="flex justify-center flex-col items-center gap-2"
          >
            <div>
              <Image
                src="/theme/icon_fans_mine_data@3x.png"
                alt="icon-data-analysis"
                width={50}
                height={50}
              />
            </div>
            <div>{t("data")}</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
