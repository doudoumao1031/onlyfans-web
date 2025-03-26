"use client"
import { useCallback, useEffect, useRef } from "react"

import html2canvas from "html2canvas"
import { useTranslations } from "next-intl"

import Image from "next/image"

import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import { UserProfile } from "@/lib/actions/profile"
import { buildImageUrl } from "@/lib/utils"

import CommonLoading from "../common/common-loading"

export default function Page({ data }: { data: UserProfile }) {
  const t = useTranslations("Profile")
  const pageRef = useRef<HTMLDivElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const handleDownload = async () => {
    if (pageRef.current) {
      const canvas = await html2canvas(pageRef.current, {
        scale: window.devicePixelRatio, // 使用设备像素比提高分辨率
        useCORS: true, // 允许跨域资源
        allowTaint: true,
        width: pageRef.current.scrollWidth, // 设置宽度
        height: pageRef.current.scrollHeight, // 设置高度
        backgroundColor: "#fff", // 使用页面的背景颜色
        scrollX: 0, // 确保从页面顶部开始绘制
        scrollY: 0,
        ignoreElements: (element) => {
          // 忽略 Header 元素
          return element.classList.contains("ignore-canvas")
        }
      })
      const dataURL = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = dataURL
      link.download = "page-screenshot.png"
      link.click()
    }
  }
  const handleShare = useCallback(() => {
    try {
      const broadcasterData = {
        type: "broadcaster",
        firstName: data?.first_name,
        lastName: data?.last_name,
        username: data?.username,
        fansId: data?.id,
        photoId: data?.photo
      }
      window.callAppApi("ShareText", JSON.stringify(broadcasterData))
    } catch (error) {
      console.log("分享失败", error)
    }
  }, [data])
  useEffect(() => {
    if (divRef.current) {
      if (headerRef.current) {
        headerRef.current.style.height = divRef.current?.offsetHeight + "px"
      }
      // 获取 CSS 变量 --top-bar 的值
      const topBarValue = getComputedStyle(document.documentElement).getPropertyValue("--top-bar").trim()
      // 检查 --top-bar 的值，并根据其值修改样式
      if (topBarValue) {
        // 例如，如果 --top-bar 存在且不为 0，则修改 top 样式
        divRef.current.style.top = topBarValue !== "0vw" ? topBarValue : "0"
      }
    }
  }, [])

  return (
    <div ref={pageRef}>
      <div className="relative">
        <div ref={divRef} className={"auto ignore-canvas fixed left-0 top-0 z-40 w-full bg-white"}>
          <Header
            right={
              <>
                <button type="button" onTouchEnd={handleDownload}>
                  <IconWithImage
                    url="/icons/profile/icon_download@3x.png"
                    width={22}
                    height={22}
                    color="#222"
                  />
                </button>
                <button type="button" onTouchEnd={handleShare}>
                  <IconWithImage
                    url="/icons/space/icon_fans_share_normal@3x.png"
                    width={22}
                    height={22}
                    color="#222"
                  />
                </button>
              </>
            }
            backIconColor="#222"
          />

        </div>
      </div>
      <div ref={headerRef} className="h-[44px] w-full bg-white"></div>
      <section className="relative rounded-t-3xl bg-white text-black">
        <section id="share-page" className="px-4 pb-3">
          <div className="mx-auto size-[90px]">
            <Image className="size-full rounded-full" src={data?.photo ? buildImageUrl(data.photo) : "/icons/icon_fansX_head.png"} width={90} height={90} alt="" />
          </div>
          <h1 className="flex flex-col items-center justify-center text-center text-lg font-bold">
            <span>
              {data?.first_name} {data?.last_name}
            </span>
            <span className="text-text-desc text-xs font-normal">{data?.username
              ? "@" + data?.username
              : t("noUserName")}</span>
          </h1>
          <div className="mt-[30px]">
            <div className="mx-auto flex size-[240px] items-center justify-center bg-black/50">
              <CommonLoading />
            </div>
          </div>
          <div className="mt-[30px] w-full">
            <div className="relative h-[100px] w-full">
              <Image objectFit="cover" fill src={data?.back_img ? buildImageUrl(data.back_img) : "/icons/base-header.png"} alt="" />
            </div>
          </div>
          <div className="mt-[30px] opacity-0">.</div>
        </section>
      </section>

    </div >

  )
}
