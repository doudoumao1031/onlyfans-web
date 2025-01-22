"use client"
import Header from "@/components/common/header"
import Link from "next/link"
import Nav from "@/components/explore/nav"

export default function Layout(
  props: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }
) {
  return (
    <>
      {props.modal}
      <div className="h-screen flex flex-col w-full">
        <Header title="Fans" titleColor="#000"
          right={
            <Link href="/profile/1" className="text-main-pink text-base">我的</Link>
          }
        />
        <div className="flex flex-col w-full h-[calc(100vh-44px)] justify-start items-center overflow-hidden">
          <Nav />
          <div className="grow px-4 py-3 w-full h-full">{props.children}</div>
        </div>
      </div>
      <div id="modal-root"/>
    </>
  )
}
