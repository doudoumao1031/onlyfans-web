"use client"
import { useTranslations } from "next-intl"

import Image from "next/image"


export type TModalProps = {
  visible?: boolean
  children?: React.ReactNode
  closeModal?: boolean
  type?: string
  title?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  cancelText?: React.ReactNode
  okText?: React.ReactNode
  cancel?: () => void
  confirm?: () => void
}
export default function Page({
  children = null,
  visible = false,
  closeModal = true,
  type,
  cancelText,
  okText,
  title,
  content,
  footer,
  cancel = () => { },
  confirm = () => { }
}: TModalProps) {
  const t = useTranslations("Common")
  if (!visible) return null
  const DefaultFooter = () => {
    return (
      <div className="flex h-[44px] w-full items-center justify-center border-t border-[#ebeced] text-base">
        <div
          onClick={() => {
            cancel()
          }}
          className="flex h-full flex-1 items-center justify-center border-r border-[#ebeced] text-center text-gray-secondary"
        >
          {cancelText || t("cancel")}
        </div>
        <div
          onClick={() => {
            confirm()
          }}
          className="text-text-theme flex h-full flex-1 items-center justify-center text-center"
        >
          {okText || t("confirm")}
        </div>
      </div>
    )
  }
  return (
    <div
      onClick={() => {
        if (closeModal) {
          cancel()
        }
      }}
      className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50"
    >
      {children}
      {type === "modal" && (
        <div
          className="w-10/12  rounded-lg bg-white"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {title && <div className="flex justify-center p-4 font-bold">{title}</div>}
          {content && <div className="flex min-h-16 justify-center p-4">{content}</div>}
          <div className="flex">{footer || DefaultFooter()}</div>
        </div>
      )}
      {type === "toast" && (
        <div className="flex items-center rounded-full bg-black bg-opacity-50 p-6 py-4">
          <Image
            src="/icons/checkbox_select_white.png"
            alt="checkbox_select_white"
            width={20}
            height={20}
          />
          {content && <span className="ml-2 text-base font-medium text-white">{content}</span>}
        </div>
      )}
    </div>
  )
}
