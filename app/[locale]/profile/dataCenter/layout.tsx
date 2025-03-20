import Header from "@/components/common/header"
import TabLinks from "@/components/common/tab-link"
import { getTranslations } from "next-intl/server"
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
      <div className="flex h-screen flex-col w-full justify-start items-center overflow-auto">
        <div className="w-full"><Header title={t("dataCenter.dataCenter")} titleColor="#000" /></div>
        <TabLinks links={links} />
        <div className="grow  py-3 w-full h-3/4">{children}</div>
      </div>
    </>
  )
}
