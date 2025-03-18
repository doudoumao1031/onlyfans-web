"use client"
import Header from "@/components/common/header"
import Link from "next/link"
import Nav from "@/components/explore/nav"
import { usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { userProfile } from "@/lib/actions/profile"
import { useTranslations } from "next-intl"
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
      <div className=" h-screen flex flex-col w-full">
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
          className={`flex flex-col w-full  justify-start items-center ${isFind ? "h-[calc(100vh-94px)]" : "h-[calc(100vh-49px)]"
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
              className={`w-full h-full ${path.indexOf("/explore/recommended") > -1 ? "" : "hidden"
                }`}
            >
              {recommended}
            </div>
            <div
              className={`w-full h-full ${path.indexOf("/explore/subscribed") > -1 ? "" : "hidden"
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
