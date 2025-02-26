"use client"
import IconWithImage from "@/components/profile/icon"
import Modal, { TModalProps } from "@/components/space/modal"
import { useState } from "react"
import dayjs from "dayjs"
import { useParams } from "next/navigation"
import { userDelFollowing, userFollowing } from "@/lib/actions/space/actions"
import { UserProfile } from "@/lib/actions/profile"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"

export default function Page({ data }: { data: UserProfile | undefined }) {
  const { addToActionQueue } = useGlobal()
  const [isFocus, setIsFocus] = useState<boolean>(data?.following || false)
  const [visible, setVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<number>(0)
  const params = useParams()
  const id = params.id // Access the dynamic route parameter
  const handleFocus = () => {
    setVisible(false)
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

  const handleFollowing = async () => {
    setIsFocus(!isFocus)
    try {
      const res = isFocus
        ? await userDelFollowing({ follow_id: Number(id), following_type: 0 })
        : await userFollowing({ follow_id: Number(id), following_type: 0 })
      if (!res || res.code !== 0) return setIsFocus(!isFocus)
      setVisible(true)
      setModalType(isFocus ? 5 : 4)
      setTimeout(() => {
        setVisible(false)
      }, 1500)
    } catch (error) {
      console.log("FETCH_ERROR,", error)
    }
    // 发送通知为关注了刷新当前页帖子列表
    addToActionQueue({
      type: ActionTypes.SPACE.REFRESH
    })
  }

  return (
    <div className="absolute top-4 right-4 flex flex-col items-end ">
      <div
        onClick={async () => {
          await handleFollowing()
        }}
        className={`w-20 h-8 rounded-full border border-theme flex justify-center items-center  ${
          isFocus ? "" : "bg-theme"
        }`}
      >
        <IconWithImage
          url={
            isFocus ? "/theme/icon_info_followed_white@3x.png" : "/theme/icon_info_follow_white@3x.png"
          }
          width={20}
          height={20}
          color={isFocus ? "var(--theme)" : "var(--white)"}
        />
        <span className={isFocus ? "text-theme" : "text-white"}>
          {isFocus ? "已关注" : "关注"}
        </span>
      </div>
      {data?.sub && (
        <div className="flex text-text-theme text-xs mt-3 items-center">
          <span className="pr-1">
            订阅：{dayjs((data && data?.sub_end_time * 1000) || 0).diff(dayjs(), "days")}天
          </span>
          <IconWithImage url="/icons/icon_arrow_right.png" width={16} height={16} color="var(--theme)" />
        </div>
      )}

      <Modal
        visible={visible}
        cancel={() => {
          setVisible(false)
        }}
        {...models[modalType]}
      ></Modal>
    </div>
  )
}
