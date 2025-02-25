import TabLink from "./components/tab-link"
import Header from "@/components/common/header"
import { getTranslations } from "next-intl/server"
export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations("Profile.income")
  return (
    <>
      <div className="flex h-screen flex-col w-full justify-start items-center overflow-auto">
        <div className="w-full">
          <Header title={t("transactionRecord")} titleColor="#000" />
        </div>
        <TabLink />
        <div className="grow  py-3 pt-0 w-full h-3/4">{children}</div>
      </div>
    </>
  )
}
