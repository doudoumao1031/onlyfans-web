import Header from "@/components/common/header"
import React from "react"
import TopTab from "@/components/profile/fans/top-tab"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"


enum FANS_TYPE {
  SUBSCRIBE = "SUBSCRIBE",
  FOLLOW = "FOLLOW"
}

export default async function Layout({ children }: {
  children: React.ReactNode,
}) {
  const t = await getTranslations("Profile.fans")
  return (
    <>
      <Header title={t("title")} titleColor={"#000"}
        right={<Link href={"/profile/fans/reply"} className="text-text-pink text-base">{t("msgReply")}</Link>}
      >
      </Header>
      <TopTab tabOptions={[
        { label: t("subscribe"), name: FANS_TYPE.SUBSCRIBE, link: "/profile/fans/manage/subscribe" },
        { label: t("follow"), name: FANS_TYPE.FOLLOW, link: "/profile/fans/manage/follow" }
      ]}
      />
      {children}
    </>
  )
}