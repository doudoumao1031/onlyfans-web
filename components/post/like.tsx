"use client"
import { useState, useMemo } from "react"

import { useCommonMessageContext } from "@/components/common/common-message"
import { starPost } from "@/lib"

import LikeBtn from "./like-btn"

interface LikeProps {
  count: number
  liked: boolean
  postId: number
  outLike?: boolean // External like (like when tipping)
}

export default function Like({ count, liked, postId, outLike }: LikeProps) {
  const [isLiked, setIsLiked] = useState<boolean>(liked)
  const [likes, setLikes] = useState<number>(count)
  const { showMessage } = useCommonMessageContext()

  // Update like state when outLike changes
  useMemo(() => {
    if (outLike) {
      setIsLiked(true)
      setLikes(count + 1)
    }
  }, [count, outLike])

  const handleLike = async () => {
    // Optimistically update UI
    setIsLiked(!isLiked)
    setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1))

    try {
      const success = await starPost({ post_id: postId, deleted: isLiked })
      if (!success) {
        // Revert if like operation failed
        setLikes((prevLikes) => (isLiked ? prevLikes + 1 : prevLikes - 1))
        setIsLiked(isLiked)
      }
    } catch (error) {
      console.error("Error liking post:", error)
      // Revert if like operation failed
      setLikes((prevLikes) => (isLiked ? prevLikes + 1 : prevLikes - 1))
      setIsLiked(isLiked)
    }
    // Action queue dispatch removed - should only happen in post detail page
    if (isLiked) {
      // 如果已经点赞，取消点赞
      showMessage("已取消点赞")
    } else {
      // 如果未点赞，增加点赞
      showMessage("感谢支持","love")
    }
  }

  return (
    <div className="relative" onClick={handleLike}>
      <LikeBtn value={likes} highlight={isLiked} />
    </div>
  )
}
