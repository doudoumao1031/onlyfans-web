import { starPost } from "@/lib"
import { useState } from "react"
import Stats from "./stats"
import { useMemo } from "react"
import { useCommonMessageContext } from "@/components/common/common-message"

export default function Like({
  count,
  liked,
  postId,
  outLike
}: {
  count: number
  liked: boolean
  postId: number
  outLike: boolean
}) {
  // 添加点赞状态
  const [likes, setLikes] = useState(count)
  const [isLiked, setIsLiked] = useState(liked)
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
      await starPost({ post_id: postId, deleted: isLiked })
    } catch (error) {
      console.error("Error liking post:", error)
      // 如果点赞失败，恢复之前的点赞状态
      setLikes((prevLikes) => (isLiked ? prevLikes + 1 : prevLikes - 1))
      setIsLiked(isLiked)
    }
  }
  return (
    <button onClick={handleLike}>
      <Stats icon="icon_fans_like" value={likes} highlight={isLiked} />
    </button>
  )
}
