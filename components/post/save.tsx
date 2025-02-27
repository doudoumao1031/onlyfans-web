"use client"

import { userCollectionPost } from "@/lib"
import { useState } from "react"
import Stats from "./stats"
import { useCommonMessageContext } from "@/components/common/common-message"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"
import { useTranslations } from "next-intl"

export default function Save({
  count,
  saved,
  notice,
  postId
}: {
  count: number
  saved: boolean
  notice?: boolean
  postId: number
}) {
  const t = useTranslations("Common.post")
  const { addToActionQueue } = useGlobal()
  const [saves, setSaves] = useState(count)
  const [isSaved, setIsSaved] = useState(saved)
  const { showMessage } = useCommonMessageContext()

  const handleSave = async () => {
    if (isSaved) {
      setSaves((prevSaves) => prevSaves - 1)
      setIsSaved(false)
      showMessage(t("cancelSaved"))
    } else {
      // 如果未点赞，增加点赞
      setSaves((prevSaves) => prevSaves + 1)
      setIsSaved(true)
      showMessage(t("saved"))
    }
    try {
      await userCollectionPost({ post_id: postId, collection: !isSaved, user_id: 1 })
    } catch (error) {
      console.error("Error saved post:", error)
      // 如果点赞失败，恢复之前的点赞状态
      setSaves((prevSaves) => (isSaved ? prevSaves + 1 : prevSaves - 1))
      setIsSaved(isSaved)
    }
    if (notice) {
      addToActionQueue({
        type: ActionTypes.EXPLORE.REFRESH
      })
    }
  }
  return (
    <button
      onClick={() => {
        handleSave()
      }}
    >
      <Stats icon="icon_fans_collect" value={saves} highlight={isSaved} />
    </button>
  )
}
