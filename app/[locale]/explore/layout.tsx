"use client"
import Header from "@/components/common/header"
import Link from "next/link"
import Nav from "@/components/explore/nav"
import { usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { userProfile } from "@/lib/actions/profile"

export default function Layout({
  children,
  feed,
  followed,
  recommended,
  subscribed
}: {
  children: React.ReactNode
  feed: React.ReactNode
  followed: React.ReactNode
  recommended: React.ReactNode
  subscribed: React.ReactNode
  // modal: React.ReactNode;
}) {
  const searchParams = useSearchParams()
  const isFind = searchParams.get("isFind")
  const path = usePathname()
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
      {/* {props.modal} */}
      <div className=" h-screen flex flex-col w-full">
        {!isFind && (
          <Header
            title="Fans"
            titleColor="#000"
            right={
              path === "/explore/subscribed" && !isBlogger ? (
                <Link href="/profile/order" className="text-text-pink text-base">
                  成为博主
                </Link>
              ) : (
                <Link href="/profile" className="text-text-pink text-base">
                  我的
                </Link>
              )
            }
          />
        )}
        <div
          className={`flex flex-col w-full  justify-start items-center ${
            isFind ? "h-[calc(100vh-94px)]" : "h-[calc(100vh-49px)]"
          }`}
        >
          <Nav isFind={!!isFind} />
          <div className="grow px-4 py-3 w-full h-[calc(100%-60px)]">
            <div className={`w-full h-full ${path.indexOf("/explore/feed") > -1 ? "" : "hidden"}`}>
              {feed}
            </div>
            <div
              className={`w-full h-full ${path.indexOf("/explore/followed") > -1 ? "" : "hidden"}`}
            >
              {followed}
            </div>
            <div
              className={`w-full h-full ${
                path.indexOf("/explore/recommended") > -1 ? "" : "hidden"
              }`}
            >
              {recommended}
            </div>
            <div
              className={`w-full h-full ${
                path.indexOf("/explore/subscribed") > -1 ? "" : "hidden"
              }`}
            >
              {subscribed}
            </div>
          </div>
        </div>
      </div>
      {/* <div id="modal-root"/> */}
    </>
  )
}
