"use client"
import html2canvas from "html2canvas"
import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import { UserProfile } from "@/lib/actions/profile"
import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
export default function QrCodeHeader({ data }: { data: UserProfile | undefined }) {
  if (!data) {
    throw new Error()
  }

  const t = useTranslations("Profile")
  const pageRef = useRef<HTMLDivElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const handleDownload = async () => {
    if (pageRef.current) {
      const canvas = await html2canvas(pageRef.current, {
        backgroundColor: "#fff", // 使用页面的背景颜色
        useCORS: true, // 允许跨域资源
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
  useEffect(() => {
    if (divRef.current) {
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
    <div className="relative h-[200px]" ref={pageRef}>
      <div ref={divRef} className={"w-full fixed top-0 left-0 z-40 auto ignore-canvas"}>
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
              <div>
                <IconWithImage
                  url="/icons/space/icon_fans_share_normal@3x.png"
                  width={22}
                  height={22}
                  color="#222"
                />
              </div>
            </>
          }
          backIconColor="#222"
        />

      </div>
      <div className="mt-[44px]">
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
        <div>二维码</div>
      </div>
    </div>
  )
}
