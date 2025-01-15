"use client"

import React, { useState } from "react"
import { PostData } from "@/lib"
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
import { CommentInfo, fetchPostComments } from "@/lib"

export default function Post({
  data,
  showSubscribe,
  showVote
}: {
  data: PostData
  showSubscribe: boolean
  showVote: boolean
}) {
  const { user, post, post_attachment, post_metric, post_vote, mention_user, collection, star } =
    data

  const { collection_count, comment_count, share_count, thumbs_up_count, tip_count } = post_metric

  const [comments, setComments] = useState<CommentInfo[]>([])
  const [showComments, setShowComments] = useState(false)

  return (
    <div className="w-full flex flex-col gap-2 mb-8">
      <UserTitle user={user} />
      <Description content={post.title} />
      <UserHomePageLink userId={user.username} />
      {post_attachment && post_attachment.length > 0 && <Media data={post_attachment} />}
      {showSubscribe && mention_user && mention_user.length > 0 && (
        <div>
          {mention_user.map((user) => (
            <Subscribe key={user.id} user={user} />
          ))}
        </div>
      )}
      {showVote && post_vote && <Vote data={post_vote} />}
      <div className="flex gap-4 justify-between pt-4 pb-6 border-b border-black/5">
        <Like count={thumbs_up_count} liked={star} postId={post.id} />
        <CommentStats count={comment_count} onClick={handleClickCommentStats} />
        <Tip count={tip_count} postId={post.id} />
        <Share count={share_count} postId={post.id} />
        <Save count={collection_count} saved={collection} postId={post.id} />
      </div>
      {showComments && <Comments comments={comments} />}
    </div>
  )

  async function handleClickCommentStats() {
    if (showComments) {
      setShowComments(false)
    } else {
      setComments(await fetchPostComments(post.id))
      setShowComments(true)
    }
  }
}
