"use client"

import React from "react"
import { PostData } from "./type"

import Comments from "./comment"
import Vote from "./vote"
import Subscribe from "./subscribe"
import UserTitle from "./user-title"
import Description from "./description"
import Media from "./media"
import UserHomePageLink from "./UserHomepageLink"
import Like from "./like"
import CommentStats from "./comment-stats"
import Tip from "./tip"
import Share from "./share"
import Save from "./save"

export default function Post({
  data,
  showSubscribe,
  showVote
}: {
  data: PostData
  showSubscribe: boolean
  showVote: boolean
}) {
  const {
    user,
    post,
    post_attachment,
    post_metric,
    post_vote,
    mention_user,
    collection,
    star,
    comments
  } = data

  const { collection_count, comment_count, share_count, thumbs_up_count, tip_count } = post_metric

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
        <CommentStats count={comment_count} />
        <Tip count={tip_count} postId={post.id} />
        <Share count={share_count} postId={post.id} />
        <Save count={collection_count} saved={collection} postId={post.id} />
      </div>
      {comments && comments.length > 0 && <Comments comments={comments} />}
    </div>
  )
}
