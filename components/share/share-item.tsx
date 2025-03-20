"use client"
import Avatar from "@/components/profile/avatar"
import html2canvas from "html2canvas"
import Header from "@/components/common/header"
import IconWithImage from "@/components/profile/icon"
import { UserProfile } from "@/lib/actions/profile"
import { useCallback, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import LazyImg from "@/components/common/lazy-img"
import { buildImageUrl } from "@/lib/utils"

export default function Page({ data }: { data: UserProfile }) {
  const t = useTranslations("Profile")
  const pageRef = useRef<HTMLDivElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

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
    <div >
      <div className="relative">
        <div ref={divRef} className={"w-full fixed top-0 left-0 z-40 auto ignore-canvas bg-white"}>
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
      <div className="w-full h-[44px]"></div>
      <section className="rounded-t-3xl bg-white relative text-black ">
        <section ref={pageRef} className="pl-4 pr-4 pb-3">
          <div className="flex justify-center">
            <Avatar showLive={data?.live_certification} fileId={data?.photo || ""} />

          </div>
          <h1 className="text-[18px] font-bold text-center justify-center items-center flex">
            <span>
              {data?.first_name} {data?.last_name}
            </span>
          </h1>
          <div className="text-center text-text-desc text-xs">
            {data?.username
              ? "@" + data?.username
              : t("noUserName")}
          </div>
          <div className="mt-[30px]">二维码占位</div>
          <div className="w-full h-[100px] mt-[30px]">
            <LazyImg
              style={{ objectFit: "cover" }}
              width={200}
              height={100}
              className="w-full h-full"
              src={data?.back_img ? buildImageUrl(data?.back_img) : "/icons/base-header.png"}
              alt={""}
            />
          </div>
        </section>
      </section>

    </div >

  )
}
