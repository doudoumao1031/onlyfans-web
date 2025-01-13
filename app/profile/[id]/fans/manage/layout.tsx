import Header from "@/components/common/header"
import Link from "next/link"
import React from "react"
import TopTab from "@/components/profile/fans/top-tab"


enum FANS_TYPE {
  SUBSCRIBE = "SUBSCRIBE",
  FOLLOW = "FOLLOW"
}

const tabOptionsById = (id: string) => {
  return [
    { label: "订阅", name: FANS_TYPE.SUBSCRIBE, link: `/profile/${id}/fans/manage/subscribe` },
    { label: "关注", name: FANS_TYPE.FOLLOW, link: `/profile/${id}/fans/manage/follow` }
  ]
}


export default async function Layout({ children, params }: {
  children: React.ReactNode,
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <Header title="粉丝管理" titleColor={"#000"}
        right={<Link href={`/profile/${id}/fans/reply`} className="text-main-pink text-base">订阅回复</Link>}
      >
      </Header>
      <TopTab tabOptions={tabOptionsById(id)}/>
      {children}
    </>
  )
}