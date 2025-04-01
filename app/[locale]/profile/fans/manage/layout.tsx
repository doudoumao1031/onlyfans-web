import React from "react"

import { getTranslations } from "next-intl/server"

import Header from "@/components/common/header"
import TabLinks from "@/components/common/tab-link"
import { Link } from "@/i18n/routing"

export default async function Layout({ children }: {
  children: React.ReactNode,
}) {
  const t = await getTranslations("Profile.fans")
  const links = [
    { name: t("subscribe"), href: "/profile/fans/manage/subscribe" },
    { name: t("follow"), href: "/profile/fans/manage/follow" }
  ]
  return (
    <>
      <Header title={t("title")} titleColor={"#000"}
        right={<Link href={"/profile/fans/reply"} className="text-text-theme text-base">{t("msgReply")}</Link>}
      >
      </Header>
      <TabLinks links={links} />
      {children}
    </>
  )
}