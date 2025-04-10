"use client"
import { useState } from "react"


import dayjs from "dayjs"
import { useTranslations } from "next-intl"

import { useParams } from "next/navigation"

import IconWithImage from "@/components/profile/icon"
import Modal, { TModalProps } from "@/components/space/modal"
import { UserProfile } from "@/lib/actions/profile"
import { userDelFollowing, userFollowing } from "@/lib/actions/space/actions"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"


export default function Page({ data }: { data: UserProfile | undefined }) {
  const { addToActionQueue } = useGlobal()
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
    <div className="absolute right-4 top-4 flex flex-col items-end ">
      <div
        onClick={async () => {
          await handleFollowing()
        }}
        className={`border-theme flex h-8 min-w-20 items-center justify-center rounded-full border px-2  ${isFocus ? "" : "bg-theme"
          }`}
      >
        <IconWithImage
          url={
            isFocus ? "/icons/icon_info_followed_white.png" : "/icons/icon_info_follow_white.png"
          }
          width={20}
          height={20}
          color={isFocus ? "var(--theme)" : "var(--white)"}
        />
        <span className={isFocus ? "text-theme" : "text-white"}>
          {isFocus ? t("fllowed") : t("fllow")}
        </span>
      </div>
      {data?.sub && (
        <div className="text-text-theme mt-3 flex items-center text-xs">
          <span className="pr-1">
            {t("subscribe")}：
            {dayjs((data && data?.sub_end_time * 1000) || 0).diff(dayjs(), "days")}
            {t("day")}
          </span>
          {/* <IconWithImage url="/icons/icon_arrow_right.png" width={16} height={16} color="#00AEF3" /> */}
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
