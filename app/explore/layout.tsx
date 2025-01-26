"use client"
import Header from "@/components/common/header"
import Link from "next/link"
import Nav from "@/components/explore/nav"
import { usePathname } from "next/navigation"
import { userApplyBlogger } from "@/lib"
import useCommonMessage from "@/components/common/common-message"
import { useState,useEffect } from "react"
import { userProfile } from "@/lib/actions/profile"

export default function Layout(
  props: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }
) {
  const path = usePathname()
  const { showMessage,renderNode } = useCommonMessage()
  const [isBlogger, setIsBlogger] = useState<boolean>(false)
  useEffect(() => {
    const initData = async () => {
      await userProfile().then((res) => {
        if (res && res.code === 0) {
          setIsBlogger(res.data.blogger)
        }
      })
    }
    initData()
  }, [])

  return (
    <>
      {props.modal}
      <div className="h-screen flex flex-col w-full">
        <Header title="Fans" titleColor="#000"
          right={
            path === "/explore/subscribed" && !isBlogger ? (
              <button type={"button"} className={"text-main-pink"} onClick={async () => {
                await userApplyBlogger().then((res) => {
                  if (res && res.code === 0) {
                    showMessage("您已成为博主", "success", {
                      duration: 2000
                    })
                  } else {
                    showMessage("申请失败")
                  }
                })
              }}
              >成为博主</button>
            ) :
              <Link href="/profile" className="text-main-pink text-base">我的</Link>
          }
        />
        <div className="flex flex-col w-full h-[calc(100vh-44px)] justify-start items-center">
          <Nav />
          {renderNode}
          <div className="grow px-4 py-3 w-full h-full">{props.children}</div>
        </div>
      </div>
      <div id="modal-root"/>
    </>
  )
}
