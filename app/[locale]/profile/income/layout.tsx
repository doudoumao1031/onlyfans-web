import { getTranslations } from "next-intl/server"

import Header from "@/components/common/header"
import TabLinks from "@/components/common/tab-link"

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations("Profile.income")
  const links = [
    { name: t("incomeCenter"), href: "/profile/income/incomeView" },
    { name: t("expensesRecord"), href: "/profile/income/expenses" }
  ]
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-start overflow-auto">
        <div className="w-full">
          <Header title={t("transactionRecord")} titleColor="#000" />
        </div>
        <TabLinks links={links}/>
        <div className="h-3/4  w-full grow py-3 pt-0">{children}</div>
      </div>
    </>
  )
}
