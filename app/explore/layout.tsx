"use client"
import Header from "@/components/common/header"
import Nav from "@/components/explore/nav"
import { useRouter } from "next/navigation"

export default function Layout(
  props: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }
) {
  const router = useRouter()
  return (
    <>
      {props.modal}
      <Header title="Fans" titleColor="#000" right={
        <button onClick={() => router.replace("/profile/1")} className="text-main-pink text-base">我的</button> }
      />
      <div className="flex h-screen flex-col w-full justify-start items-center">
        <Nav />
        <div className="grow px-4 py-3 w-full h-3/4">{props.children}</div>
      </div>
      <div id="modal-root"/>
    </>
  )
}
