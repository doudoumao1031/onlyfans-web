"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ApiResponse, CommentInfo, fetchPostComments, fetchWithPost, PostData } from "@/lib"
import Comments from "./comment"
import Vote from "./vote"
import Subscribe from "./subscribe"
import UserTitle from "./user-title"
import Description from "./description"
import Media from "./media"
import UserHomePageLink from "./user-homepage-link"
import Like from "./like"
import CommentStats from "./comment-stats"
import Tip from "./tip"
import Share from "./share"
import Save from "./save"
import { Vote as VoteData } from "./types"

export default function Post({
  data,
  hasVote,
  hasSubscribe
}: {
  data: PostData
  hasVote: boolean
  hasSubscribe: boolean
}) {
  const { user, post, post_attachment, post_metric, mention_user, collection, star } = data
  const { collection_count, comment_count, share_count, thumbs_up_count, tip_count } = post_metric
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<CommentInfo[]>()
  const [showVote, setShowVote] = useState(false)

  return (
    <div className="w-full flex flex-col gap-2 mb-8">
      <UserTitle user={user} />
      <Description content={post.title} />
      <UserHomePageLink userId={user.username} />
      {post_attachment && post_attachment.length > 0 && <Media data={post_attachment} />}
      {hasSubscribe && mention_user && mention_user.length > 0 && (
        <div>
          {mention_user.map((user) => (
            <Subscribe key={user.id} user={user} />
          ))}
        </div>
      )}
      {hasVote && (
        <div className="flex gap-2 items-end" onClick={() => setShowVote((pre) => !pre)}>
          <Image src="/icons/vote.png" alt="" width={20} height={20} />
          <div className="text-red-500 text-sm">投票</div>
          {showVote ? (
            <Image src="/icons/arrow_up.png" alt="" width={20} height={20} />
          ) : (
            <Image src="/icons/arrow_down.png" alt="" width={20} height={20} />
          )}
        </div>
      )}
      {hasVote && showVote && <Vote postId={post.id} />}
      <div className="flex gap-4 justify-between pt-4 pb-6 border-b border-black/5">
        <Like count={thumbs_up_count} liked={star} postId={post.id} />
        <CommentStats count={comment_count} onClick={toggleComments} />
        <Tip count={tip_count} postId={post.id} />
        <Share count={share_count} postId={post.id} />
        <Save count={collection_count} saved={collection} postId={post.id} />
      </div>
      {showComments && comments && (
        <Comments
          post_id={post.id}
          comments={comments}
          removeComment={removeComment}
          fetchComments={async () => setComments(await fetchPostComments(post.id))}
        />
      )}
    </div>
  )

  function removeComment(id: number) {
    setComments(comments?.filter((c) => c.id !== id))
  }

  async function toggleComments() {
    if (!showComments) {
      if (!comments) {
        setComments(await fetchPostComments(post.id))
      }
      setShowComments(true)
    } else {
      setShowComments(false)
    }
  }
}
