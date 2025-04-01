import { getTranslations } from "next-intl/server"

import Header from "@/components/common/header"
import TabLinks from "@/components/common/tab-link"

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Profile")
  const links = [
    { name: t("dataCenter.dataView"), href: "/profile/dataCenter/dataView" },
    { name: t("dataCenter.feeds"), href: "/profile/dataCenter/feeds" }
  ]
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-start overflow-auto">
        <div className="w-full"><Header title={t("dataCenter.dataCenter")} titleColor="#000" /></div>
        <TabLinks links={links} />
        <div className="h-3/4  w-full grow py-3">{children}</div>
      </div>
    </>
  )
}
