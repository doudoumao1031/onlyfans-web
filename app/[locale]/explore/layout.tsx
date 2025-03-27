"use client"
import { useState, useEffect } from "react"

import { useTranslations } from "next-intl"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"


import Header from "@/components/common/header"
import Nav from "@/components/explore/nav"
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
  const t = useTranslations("Explore")
  const searchParams = useSearchParams()
  const isFind = searchParams.get("isFind")
  const path = usePathname()
  const [isBlogger, setIsBlogger] = useState<boolean>(true)
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
      <div className=" flex h-screen w-full flex-col">
        {!isFind && (
          <Header
            title="Fans"
            titleColor="#000"
            right={
              !isBlogger ? (
                <Link href="/profile" className="text-theme text-base">
                  {t("BecomeABlogger")}
                </Link>
              ) : (
                <Link href="/profile" className="text-theme text-base">
                  {t("My")}
                </Link>
              )
            }
          />
        )}
        <div
          className={`flex w-full flex-col  items-center justify-start ${isFind ? "h-[calc(100vh-94px)]" : "h-[calc(100vh-49px)]"
            }`}
        >
          <Nav isFind={!!isFind} />
          <div className="h-[calc(100%-60px)] w-full grow  py-3">
            <div className={`size-full ${path.indexOf("/explore/feed") > -1 ? "" : "hidden"}`}>
              {feed}
            </div>
            <div
              className={`size-full ${path.indexOf("/explore/followed") > -1 ? "" : "hidden"}`}
            >
              {followed}
            </div>
            <div
              className={`size-full ${path.indexOf("/explore/recommended") > -1 ? "px-4" : "hidden"
                }`}
            >
              {recommended}
            </div>
            <div
              className={`size-full ${path.indexOf("/explore/subscribed") > -1 ? "px-4" : "hidden"
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
