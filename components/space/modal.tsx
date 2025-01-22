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
  cancel = () => {},
  confirm = () => {}
}: TModalProps) {
  if (!visible) return null
  const DefaultFooter = () => {
    return (
      <div className="w-full flex items-center justify-center text-[16px] border-t border-[#ebeced] h-[44px]">
        <div
          onClick={() => {
            cancel()
          }}
          className="h-full flex justify-center items-center flex-1 text-center text-[#6D7781] border-r border-[#ebeced]"
        >
          {cancelText || "取消"}
        </div>
        <div
          onClick={() => {
            confirm()
          }}
          className="h-full flex justify-center items-center flex-1 text-center text-main-pink"
        >
          {okText || "确定"}
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
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[100] flex justify-center items-center"
    >
      {children}
      {type === "modal" && (
        <div
          className="w-10/12  rounded-lg bg-white"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {title && <div className="p-4 font-bold flex justify-center">{title}</div>}
          {content && <div className="p-4 min-h-16 flex justify-center">{content}</div>}
          <div className="flex">{footer || DefaultFooter()}</div>
        </div>
      )}
      {type === "toast" && (
        <div className="bg-black bg-opacity-50 p-6 pt-4 pb-4 rounded-full flex items-center">
          <Image
            src="/icons/checkbox_select_white.png"
            alt="checkbox_select_white"
            width={20}
            height={20}
          />
          {content && <span className="text-white text-[16px] font-medium ml-2">{content}</span>}
        </div>
      )}
    </div>
  )
}
