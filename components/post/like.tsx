import { useState , useMemo } from "react"

import { useCommonMessageContext } from "@/components/common/common-message"
import { starPost } from "@/lib"
import { ActionTypes, useGlobal } from "@/lib/contexts/global-context"

import LikeBtn from "./like-btn"
import Stats from "./stats"

export default function Like({
  count,
  liked,
  postId,
  notice,
  outLike
}: {
  count: number
  liked: boolean
  postId: number
  notice?: boolean
  outLike: boolean // 外部点赞(打赏同时点赞)
}) {
  // 添加点赞状态
  const [likes, setLikes] = useState(count)
  const [isLiked, setIsLiked] = useState(liked)
  const { addToActionQueue } = useGlobal()
  useMemo(() => {
    if (outLike) {
      setIsLiked(true)
      setLikes(count + 1)
    }
  }, [count, outLike])

  const { showMessage } = useCommonMessageContext()

  const handleLike = async () => {
    if (isLiked) {
      // 如果已经点赞，取消点赞
      setLikes((prevLikes) => prevLikes - 1)
      setIsLiked(false)
      showMessage("已取消点赞")
    } else {
      // 如果未点赞，增加点赞
      setLikes((prevLikes) => prevLikes + 1)
      setIsLiked(true)
      showMessage("感谢支持", "love")
    }
    // 静默提交点赞操作
    try {
      const success = await starPost({ post_id: postId, deleted: isLiked })
      if (!success) {
        // 如果点赞失败，恢复之前的点赞状态
        setLikes((prevLikes) => (isLiked ? prevLikes + 1 : prevLikes - 1))
        setIsLiked(isLiked)
      }
    } catch (error) {
      console.error("Error liking post:", error)
      // 如果点赞失败，恢复之前的点赞状态
      setLikes((prevLikes) => (isLiked ? prevLikes + 1 : prevLikes - 1))
      setIsLiked(isLiked)
    }
    if (notice) {
      addToActionQueue({
        type: ActionTypes.EXPLORE.REFRESH
      })
    }
  }
  return (
    <div className=" relative" onClick={handleLike}>
      {/* <Stats icon="icon_fans_like" value={likes} highlight={isLiked} /> */}
      <LikeBtn value={likes} highlight={isLiked} />
    </div>
  )
}
