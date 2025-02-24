import { userCollectionPost } from "@/lib"
import { useState } from "react"
import Stats from "./stats"
import { useCommonMessageContext } from "@/components/common/common-message"

export default function Save({
  count,
  saved,
  postId
}: {
  count: number
  saved: boolean
  postId: number
}) {
  const [saves, setSaves] = useState(count)
  const [isSaved, setIsSaved] = useState(saved)
  const { showMessage } = useCommonMessageContext()

  const handleSave = async () => {
    if (isSaved) {
      setSaves((prevSaves) => prevSaves - 1)
      setIsSaved(false)
      showMessage("已取消收藏")
    } else {
      // 如果未点赞，增加点赞
      setSaves((prevSaves) => prevSaves + 1)
      setIsSaved(true)
      showMessage("已收藏")
    }
    try {
      await userCollectionPost({ post_id: postId, collection: !isSaved, user_id: 1 })
    } catch (error) {
      console.error("Error saved post:", error)
      // 如果点赞失败，恢复之前的点赞状态
      setSaves((prevSaves) => (isSaved ? prevSaves + 1 : prevSaves - 1))
      setIsSaved(isSaved)
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
