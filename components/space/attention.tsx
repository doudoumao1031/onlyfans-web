"use client"
import IconWithImage from "@/components/profile/icon"
import Modal, { TModalProps } from "@/components/space/modal"
import { useState } from "react"
// import SubScribeConfirm from '@/components/space/subscribe-confirm'
import { userDelFollowing, userFollowing } from "@/lib/actions/space/actions"
import { UserProfile } from "@/lib/actions/profile"
export default function Page({ data }: { data: UserProfile | undefined }) {
  const [isFocus, setIsFocus] = useState<boolean>(data?.following || false)
  const [visible, setVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<number>(0)
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false)
  const handleFocus = () => {
    setVisible(false)
    setIsOpenDrawer(true)
  }
  const handleTopUp = () => {
    setVisible(false)
  }
  const models: TModalProps[] = [
    {
      type: "modal",
      closeModal: false,
      content: <div className="p-4 pb-6">订阅博主与Ta畅谈</div>,
      okText: "免费/订阅",
      confirm: () => handleFocus()
    },
    {
      type: "modal",
      closeModal: false,
      content: <div className="p-4 pb-6">订阅博主与Ta畅谈</div>,
      confirm: () => handleFocus()
    },
    {
      type: "modal",
      closeModal: false,
      content: <div className="p-4 pb-6">余额不足</div>,
      okText: "充值",
      confirm: () => handleTopUp()
    },
    {
      type: "toast",
      content: "订阅成功"
    },
    {
      type: "toast",
      content: "关注成功"
    },
    {
      type: "toast",
      content: "取消成功"
    }
  ]

  const handleFllowing = async () => {
    setIsFocus(!isFocus)
    try {
      const res = isFocus
        ? await userDelFollowing({ follow_id: 1, following_type: 0 })
        : await userFollowing({ follow_id: 1, following_type: 0 })
      if (!res || res.code !== 0) return setIsFocus(!isFocus)
      setVisible(true)
      setModalType(isFocus ? 5 : 4)
      setTimeout(() => {
        setVisible(false)
      }, 1500)
    } catch (error) {
      console.log("FETCH_ERROR,", error)
    }
  }

  return (
    <div className="absolute top-4 right-4 flex flex-col items-end ">
      <div
        onClick={() => {
          handleFllowing()
        }}
        className={`w-20 h-8 rounded-full border border-[#ff8492] flex justify-center items-center  ${
          isFocus ? "" : "bg-[#ff8492]"
        }`}
      >
        <IconWithImage
          url={
            isFocus ? "/icons/icon_info_followed_white.png" : "/icons/icon_info_follow_white.png"
          }
          width={20}
          height={20}
          color={isFocus ? "#ff8492" : "#fff"}
        />
        <span className={isFocus ? "text-[#ff8492]" : "text-white"}>
          {isFocus ? "已关注" : "关注"}
        </span>
      </div>
      <div className="flex text-main-pink text-xs mt-3 items-center">
        <span className="pr-1">订阅：999天</span>
        <IconWithImage url="/icons/icon_arrow_right.png" width={16} height={16} color="#ff8492" />
      </div>
      <Modal
        visible={visible}
        cancel={() => {
          setVisible(false)
        }}
        {...models[modalType]}
      ></Modal>
      {/* <SubScribeConfirm data={data} isOpen={isOpenDrawer} setIsOpen={setIsOpenDrawer}> </SubScribeConfirm> */}
    </div>
  )
}
