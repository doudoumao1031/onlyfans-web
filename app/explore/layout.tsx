"use client"
import Header from "@/components/common/header"
import Nav from "@/components/explore/nav"
import Link from "next/link"

export default function Layout(
  props: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }
) {
  return (
    <>
      {props.modal}
      <Header title="Fans" titleColor="#000" right={
        <Link href="/profile/1" className="text-main-pink text-base">我的</Link> }
      />
      <div className="flex h-screen flex-col w-full justify-start items-center">
        <Nav />
        <div className="grow px-4 py-3 w-full h-3/4">{props.children}</div>
      </div>
      <div id="modal-root"/>
    </>
  )
}
