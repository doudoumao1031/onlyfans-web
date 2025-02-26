import DataViewItem from "@/components/profile/dataCenter/dataViewItem"
import { getTranslations } from "next-intl/server"

export default async function Page() {
  const t = await getTranslations("Profile")
  const dataOptions = {
    play_count: t("dataCenter.playCount"),
    access_count: t("dataCenter.accessCount"),
    subscribe_count: t("dataCenter.subscribeCount")
  }
  const focusOptions = {
    following_count: t("dataCenter.followingCount"),
    following_del_count: t("dataCenter.followingDelCount"),
    following_all_count: t("dataCenter.followingAllCount")
  }
  return (
    <>
      <DataViewItem title={t("dataCenter.dataTraffic")} tabs={dataOptions} />
      <DataViewItem title={t("dataCenter.focusChange")} tabs={focusOptions} />
    </>
  )
}
