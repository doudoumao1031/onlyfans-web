import Header from "@/components/common/header"
import Link from "next/link"
import React from "react"
import TopTab from "@/components/profile/fans/top-tab"


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
      <TopTab id={id} />
      {children}
    </>
  )
}