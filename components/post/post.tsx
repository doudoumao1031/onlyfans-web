"use client"

import React, { useEffect, useMemo, useState } from "react"

import { useTranslations } from "next-intl"

import Image from "next/image"
import { usePathname } from "next/navigation"


import useCommonMessage, { CommonMessageContext } from "@/components/common/common-message"
import UserCard from "@/components/user/user-card"
import { Link } from "@/i18n/routing"
import { CommentInfo, fetchPostComments, PostData } from "@/lib"
import { useGlobal } from "@/lib/contexts/global-context"

import Comments from "./comment"
import CommentSkeleton from "./comment-skeleton"
import CommentStats from "./comment-stats"
import Description from "./description"
import Like from "./like"
import Media from "./media"
import Save from "./save"
import Share from "./share"
import Tip from "./tip"
import UserTitle from "./user-title"
import { buildUserHomePagePath } from "./utils"
import Vote from "./vote"



export default function Post({
  data,
  hasVote,
  hasSubscribe,
  isInfoPage,
  space,
  followConfirm
}: {
  data: PostData
  hasVote: boolean
  hasSubscribe: boolean
  isInfoPage?: boolean //是否详情页
  space?: boolean //是否空间
  followConfirm?: () => void //点击媒体关注弹出确认
}) {
  const t = useTranslations("Common.post")
  const { sid } = useGlobal()
  const { user, post, post_attachment, post_metric, mention_user, collection, star, post_vote } =
    data
  const { collection_count, comment_count, share_count, thumbs_up_count, tip_count } = post_metric
  const [showComments, setShowComments] = useState(isInfoPage)
  const [comments, setComments] = useState<CommentInfo[]>()
  const [showVote, setShowVote] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false)
  const [tipStar, setTipStar] = useState<boolean>(false)
  const path = usePathname()

  const isSpace = () => {
    return path.indexOf("/space") > -1
  }
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

  const { showMessage, renderNode } = useCommonMessage()

  const [adjustCommentCount, setAdjustCommentCount] = useState(0)

  return (
    <CommonMessageContext.Provider value={useMemo(() => ({ showMessage }), [showMessage])}>
      {renderNode}
      <div className="mb-2 flex w-full flex-col gap-2">
        <div className="px-4  text-[14px]">
          {!isInfoPage && (
          <UserTitle user={user} pinned={post.pinned} pub_time={post.pub_time} space={space} />
        )}

          <Description
            mentionUser={mention_user}
            content={post.title}
            linkRender={!isInfoPage ? linkRender : undefined}
          />
          {!isSpace() && (
          <div className="mt-1">
            <Link href={buildUserHomePagePath(user.id)} className="text-theme  px-3">
              {t("moreInfoText")}
            </Link>
          </div>
        )}
        </div>
        {post_attachment && post_attachment.length > 0 && (
          <Media
            data={post_attachment}
            post={post}
            user={user}
            isInfoPage={isInfoPage}
            followConfirm={followConfirm}
          />
        )}
        <div className="px-4">
          {hasSubscribe && mention_user && mention_user.length > 0 && (
          <div className={"grid gap-2"}>
            {mention_user.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
          {hasSubscribe && user && !user?.sub && !mention_user && <UserCard user={user} />}
          {hasVote && post_vote && (
          <div className="mt-2.5 flex items-end gap-2" onClick={() => setShowVote((pre) => !pre)}>
            <Image src="/theme/icon_fans_vote_red@3x.png" alt="" width={20} height={20} />
            <div className="text-theme text-sm">{t("vote")}</div>
            {showVote ? (
              <Image src="/theme/icon_arrow_up_fold@3x.png" alt="" width={20} height={20} />
            ) : (
              <Image src="/theme/icon_arrow_unfold@3x.png" alt="" width={20} height={20} />
            )}
          </div>
        )}
          {hasVote && showVote && <Vote postId={post.id} />}
          <div className="flex items-center justify-between gap-4 border-b border-black/5 pr-[10px]">
            <Like
              count={thumbs_up_count}
              liked={star}
              postId={post.id}
              notice={isInfoPage}
              outLike={!star && tipStar}
            />
            {isInfoPage ? (
              <CommentStats
                count={comment_count + adjustCommentCount}
                disable={post.visibility !== 0 && user.id !== sid}
                onClick={async () => {
                if (post.visibility === 0) await toggleComments()
              }}
              />
          ) : (
            <Link href={`/postInfo/${post.id}`} className="flex items-end">
              <CommentStats
                count={comment_count + adjustCommentCount}
                disable={post.visibility !== 0 && user.id !== sid}
              />
            </Link>
          )}
            <Tip
              count={tip_count}
              postId={post.id}
              self={sid === user.id}
              tipStar={setTipStar}
              notice={isInfoPage}
            />
            <Share
              count={share_count}
              postId={post.id}
              shareParams={{
              postId: post.id.toString(),
              title: post.title,
              firstName: user.first_name,
              lastName: user.last_name,
              username: user.username,
              fansId: user.id.toString(),
              data: post_attachment
            }}
            />
            <Save count={collection_count} saved={collection} postId={post.id} notice={isInfoPage} />
          </div>
          {showComments &&
          (commentsLoading ? (
            <CommentSkeleton></CommentSkeleton>
          ) : (
            <Comments
              post_id={post.id}
              post={post}
              comments={comments || []}
              removeComment={removeComment}
              fetchComments={async () => setComments(await fetchPostComments(post.id))}
              increaseCommentCount={() => setAdjustCommentCount((c) => c + 1)}
            />
          ))}
        </div>
      </div>
    </CommonMessageContext.Provider>
  )

  function removeComment(id: number) {
    setComments(comments?.filter((c) => c.id !== id))
    setAdjustCommentCount((c) => c - 1)
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
