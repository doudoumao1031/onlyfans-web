"use client"
import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import { UserProfile } from "@/lib/actions/profile"
import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import LazyImg from "../common/lazy-img"
export default function SpaceHeader({ data }: { data: UserProfile | undefined }) {
  if (!data) {
    throw new Error()
  }
  const [isTop, setIsTop] = useState<boolean>(false)
  useEffect(() => {
    window.addEventListener("scroll", () => {
      const refEl = document.getElementById("refEl")

      if (!refEl) return
      const height = refEl.getBoundingClientRect().top
      setIsTop(height < 0)
    })
  }, [])
  // const throt = (value: boolean) => {
  //   isTop !== value && setIsTop(value)
  // }
  return (
    <div
      className=" relative h-[200px]"
    >
      <div className="absolute w-full h-full z-0">
        <LazyImg style={{ objectFit: "cover" }} width={200} height={400} className="w-full h-full" src={data.back_img ? buildImageUrl(data.back_img) : getUserDefaultBackImg(data.username)} alt={""} />
      </div>
      <div className={`w-full fixed top-0 left-0 z-50 ${isTop ? "bg-[#fff]" : "auto"}`}>
        <Header
          leftTitle={
            <span
              className={` pt-[1px] shrink-0 text-[18px] font-semibold ml-8 ${isTop ? "text-[#222]" : "text-[#fff]"
              }`}
            >
              {isTop ? "我的空间" : ""}
            </span>
          }
          right={
            <>
              <Link className="flex items-center justify-center" href="/search">
                <IconWithImage
                  url="/icons/space/icon_nav_search@3x.png"
                  width={22}
                  height={22}
                  color={isTop ? "#222" : "#fff"}
                />
              </Link>
              <IconWithImage
                url="/icons/space/icon_nav_code_black@3x.png"
                width={22}
                height={22}
                color={isTop ? "#222" : "#fff"}
              />
              <IconWithImage
                url="/icons/space/icon_fans_share_normal@3x.png"
                width={22}
                height={22}
                color={isTop ? "#222" : "#fff"}
              />
            </>
          }
          backIconColor={isTop ? "#222" : "#fff"}
        />
        <div className={`text-xs pl-6 pr-6 pb-2 ${isTop ? "text-main-pink" : "text-white"}`}>
          {data.top_info}
        </div>
      </div>
    </div>
  )
}
