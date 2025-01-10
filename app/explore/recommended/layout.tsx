"use client"
import Header from "@/components/explore/recommended/header"

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex h-screen flex-col w-full justify-start items-center">
        <Header />
        <div className="grow py-3 w-full h-3/4">{children}</div>
      </div>
    </>
  )
}
