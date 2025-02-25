"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { CommentInfo, fetchPostComments, PostData } from "@/lib"
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
import { Link } from "@/i18n/routing"
import CommentSkeleton from "./comment-skeleton"
import { useGlobal } from "@/lib/contexts/global-context"

export default function Post({
  data,
  hasVote,
  hasSubscribe,
  isInfoPage,
  space
}: {
  data: PostData
  hasVote: boolean
  hasSubscribe: boolean
  isInfoPage?: boolean //是否详情页
  space?: boolean //是否空间
}) {
  const { sid } = useGlobal()
  const { user, post, post_attachment, post_metric, mention_user, collection, star, post_vote } =
    data
  const { collection_count, comment_count, share_count, thumbs_up_count, tip_count } = post_metric
  const [showComments, setShowComments] = useState(isInfoPage)
  const [comments, setComments] = useState<CommentInfo[]>()
  const [showVote, setShowVote] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false)
  const [tipStar, setTipStar] = useState<boolean>(false)
  const linkRender = (content: string) => {
    return <Link href={`/postInfo/${post.id}`}>{content}</Link>
  }

  useEffect(() => {
    if (isInfoPage) {
      const loadComments = async () => {
        setCommentsLoading(true)
        try {
          const res = await fetchPostComments(post.id)
          setComments(res)
        } catch (error) {
          console.error("Error loading comments:", error)
        } finally {
          setCommentsLoading(false)
        }
      }
      loadComments()
    }
  }, [post.id, isInfoPage])

  return (
    <div className="w-full flex flex-col gap-2 mb-2">
      {!isInfoPage && <UserTitle user={user} pinned={post.pinned} pub_time={post.pub_time} space={space} />}

      <Description content={post.title} linkRender={!isInfoPage ? linkRender : undefined} />
      <UserHomePageLink userId={user.id.toString()} postId={post.id} />
      {post_attachment && post_attachment.length > 0 && (
        <Media data={post_attachment} post={post} user={user} isInfoPage={isInfoPage}/>
      )}
      {hasSubscribe && mention_user && mention_user.length > 0 && (
        <div className={"grid gap-2"}>
          {mention_user.map((user) => (
            <Subscribe key={user.id} user={user} />
          ))}
        </div>
      )}
      {hasSubscribe && user && !user?.sub && !mention_user && (
        <div>
          <Subscribe user={user} />
        </div>
      )}
      {hasVote && post_vote && (
        <div className="flex gap-2 items-end" onClick={() => setShowVote((pre) => !pre)}>
          <Image src="/icons/vote.png" alt="" width={20} height={20} />
          <div className="text-pink text-sm">投票</div>
          {showVote ? (
            <Image src="/icons/arrow_up.png" alt="" width={20} height={20} />
          ) : (
            <Image src="/icons/arrow_down.png" alt="" width={20} height={20} />
          )}
        </div>
      )}
      {hasVote && showVote && <Vote postId={post.id} />}
      <div className="flex gap-4 justify-between pt-2 pb-4 border-b border-black/5">
        <Like count={thumbs_up_count} liked={star} postId={post.id} outLike={!star && tipStar} />
        {isInfoPage ? (
          <CommentStats count={comment_count} onClick={toggleComments} />
        ) : (
          <Link href={`/postInfo/${post.id}`}>
            <CommentStats count={comment_count} />
          </Link>
        )}
        <Tip count={tip_count} postId={post.id} self={sid === user.id} tipStar={setTipStar} />
        <Share count={share_count} postId={post.id} />
        <Save count={collection_count} saved={collection} postId={post.id} />
      </div>
      {showComments &&
        (commentsLoading ? (
          <CommentSkeleton></CommentSkeleton>
        ) : (
          <Comments
            post_id={post.id}
            comments={comments || []}
            removeComment={removeComment}
            fetchComments={async () => setComments(await fetchPostComments(post.id))}
          />
        ))}
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
