"use client"
import IconWithImage from "@/components/profile/icon"
import Modal, { TModalProps } from "@/components/space/modal"
import { useState } from "react"
import dayjs from "dayjs"
import { useParams } from "next/navigation"

// import SubScribeConfirm from '@/components/space/subscribe-confirm'
import { userDelFollowing, userFollowing } from "@/lib/actions/space/actions"
import { UserProfile } from "@/lib/actions/profile"
import { useTranslations } from "next-intl"
export default function Page({ data }: { data: UserProfile | undefined }) {
  const [isFocus, setIsFocus] = useState<boolean>(data?.following || false)
  const [visible, setVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<number>(0)
  const params = useParams()
  const t = useTranslations("Space")
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
      content: <div className="p-4 pb-6">{t("tip3")}</div>,
      okText: t("FreeAndSubscription"),
      confirm: () => handleFocus()
    },
    {
      type: "modal",
      closeModal: false,
      content: <div className="p-4 pb-6">{t("tip3")}</div>,
      confirm: () => handleFocus()
    },
    {
      type: "modal",
      closeModal: false,
      content: <div className="p-4 pb-6"> </div>,
      okText: t("topUp"),
      confirm: () => handleTopUp()
    },
    {
      type: "toast",
      content: t("subscribeSuccess")
    },
    {
      type: "toast",
      content: t("fllowSuccess")
    },
    {
      type: "toast",
      content: t("cancelled")
    }
  ]

  const handleFllowing = async () => {
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
      {data?.sub && (
        <div className="flex text-text-pink text-xs mt-3 items-center">
          <span className="pr-1">
            订阅：{dayjs((data && data?.sub_end_time * 1000) || 0).diff(dayjs(), "days")}天
          </span>
          <IconWithImage url="/icons/icon_arrow_right.png" width={16} height={16} color="#ff8492" />
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
