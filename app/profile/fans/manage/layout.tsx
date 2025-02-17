import Header from "@/components/common/header"
import Link from "next/link"
import React from "react"
import TopTab from "@/components/profile/fans/top-tab"


enum FANS_TYPE {
  SUBSCRIBE = "SUBSCRIBE",
  FOLLOW = "FOLLOW"
}

export default function Layout({ children }: {
  children: React.ReactNode,
}) {
  return (
    <>
      <Header title="粉丝管理" titleColor={"#000"}
        right={<Link href={"/profile/fans/reply"} className="text-text-pink text-base">订阅回复</Link>}
      >
      </Header>
      <TopTab tabOptions={[
        { label: "订阅", name: FANS_TYPE.SUBSCRIBE, link: "/profile/fans/manage/subscribe" },
        { label: "关注", name: FANS_TYPE.FOLLOW, link: "/profile/fans/manage/follow" }
      ]}
      />
      {children}
    </>
  )
}