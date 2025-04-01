"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"

import { useCommonMessageContext } from "@/components/common/common-message"
import { userCollectionPost } from "@/lib"
import { revalidateProfileData } from "@/lib/actions/revalidate/actions"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"

import Stats from "./stats"

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
      setSaves((pre) => pre - 1)
      setIsSaved(false)
      showMessage(t("cancelSaved"))
    } else {
      setSaves((pre) => pre + 1)
      setIsSaved(true)
      showMessage(t("saved"))
    }
    try {
      await userCollectionPost({ post_id: postId, collection: !isSaved })
      // Trigger profile data revalidation using the server action
      await revalidateProfileData()
      // No need for additional action queue dispatch since revalidateProfileData handles cache invalidation
    } catch (error) {
      console.error("Error saved post:", error)
      setSaves((pre) => (isSaved ? pre + 1 : pre - 1))
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
      onTouchEnd={() => {
        handleSave()
      }}
    >
      <Stats icon="icon_fans_collect" value={saves} highlight={isSaved} />
    </button>
  )
}
