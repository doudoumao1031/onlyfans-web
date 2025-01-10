"use client"

import React, { ReactElement, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Vote as VoteData,
  Comment as CommentData,
  PostData,
  User,
  Attachment,
  FileType
} from "./type"
import {
  isMention,
  buildUserHomePagePath,
  getUserIdFromMention,
  buildUserHomePagePathForDisplay,
  buildMention
} from "./util"
import SubscribedDrawer from "../explore/subscribed-drawer"
import { postSharLog } from "@/lib"

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

  const {
    collection_count,
    comment_count,
    share_count,
    thumbs_up_count,
    tip_count
  } = post_metric

  return (
    <div className="w-full flex flex-col gap-2 mb-8">
      <UserTitle user={user} />
      <Description content={post.title} />
      <UserHomePageLink userId={user.username} />
      {post_attachment && post_attachment.length > 0 && (
        <Media data={post_attachment} />
      )}
      {showSubscribe && mention_user && mention_user.length > 0 && (
        <div>
          {mention_user.map((user) => (
            <SubscribeCard key={user.id} user={user} />
          ))}
        </div>
      )}
      {showVote && post_vote && <Vote data={post_vote} />}
      <div className="flex gap-4 justify-between pt-4 pb-6 border-b border-black/5">
        <Like count={thumbs_up_count} liked={star} postId={post.id} />
        <CommentStats count={comment_count} />
        <Tip userId={user.id} count={tip_count} />
        <Share count={share_count} postId={post.id} />
        <Save count={collection_count} saved={collection} postId={post.id} />
      </div>
      {comments && comments.length > 0 && <Comments comments={comments} />}
    </div>
  )
}

function Comments({ comments }: { comments: CommentData[] }) {
  return (
    <div className="flex flex-col gap-4">
      {comments.map((c, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Comment comment={c} />
          {c.reply_arr?.length && (
            <div className="pl-11 flex flex-col gap-2">
              {c.reply_arr.map((r, j) => (
                <Comment comment={r} key={j} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Comment({ comment }: { comment: CommentData }) {
  const { user, content, thumbs_up_count } = comment
  const { photo, username } = user

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Avatar fileId={photo} width={10} />
        <div className="flex flex-col gap-1">
          <div className="text-xs text-[#FF8492]">{username}</div>
          <div className="text-sm">{content}</div>
          <div className="flex gap-4 text-xs text-[#6D7781]">
            <div>回复</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center ml-2">
        <Image
          src="/icons/thumbup.png"
          width={20}
          height={20}
          alt=""
          className="max-w-4"
        />
        <div className="text-[10px] text-[#6D7781]">{thumbs_up_count}</div>
      </div>
    </div>
  )
}

function Vote({ data }: { data: VoteData }) {
  const { title, items, stop_time } = data
  const secondsToExpire = Math.floor((stop_time * 1000 - Date.now()) / 1000)
  const [showOptions, setShowOptions] = useState(false)
  const [showOptionAmount, setShowOptionAmount] = useState(3)
  const [selectedVoteIndex, setSelectedVoteIndex] = useState(-1)
  const totalVotes = items.reduce((t, o) => t + o.vote_count, 0)

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex gap-2 items-end"
        onClick={() => setShowOptions((pre) => !pre)}
      >
        <Image src="/icons/vote.png" alt="" width={20} height={20} />
        <div className="text-red-500 text-sm">{title}</div>
        {showOptions ? (
          <Image src="/icons/arrow_up.png" alt="" width={20} height={20} />
        ) : (
          <Image src="/icons/arrow_down.png" alt="" width={20} height={20} />
        )}
      </div>
      {showOptions && (
        <div className="flex flex-col gap-1">
          {items.slice(0, showOptionAmount).map(({ content, vote_count }, i) =>
            secondsToExpire < 0 ? (
              <div
                key={i}
                className="w-full h-11 border rounded-md px-2 flex justify-between items-center bg-no-repeat"
                style={{
                  backgroundImage: `${
                    selectedVoteIndex === i
                      ? "url(/icons/pink.png)"
                      : "url(/icons/silver.png)"
                  }`,
                  backgroundSize: `${(vote_count / totalVotes) * 100}% 100%`,
                  borderColor: `${
                    selectedVoteIndex === i ? "#FF8492" : "#DDDDDD"
                  }`
                }}
                onClick={() => setSelectedVoteIndex(i)}
              >
                <div className="flex gap-1 h-full items-center">
                  {selectedVoteIndex === i && (
                    <Image
                      src="/icons/select.png"
                      alt=""
                      width={20}
                      height={20}
                    />
                  )}
                  <div>{content}</div>
                </div>
                <div className="pr-3">{vote_count}票</div>
              </div>
            ) : (
              <div
                key={i}
                className="w-full h-11 border border-[#DDDDDD] rounded-md flex justify-center items-center"
              >
                <div>{content}</div>
              </div>
            )
          )}
          {showOptionAmount < items.length && (
            <div
              className="w-full h-11 border border-[#DDDDDD] rounded-md flex justify-center items-center"
              onClick={() => setShowOptionAmount(items.length)}
            >
              <div>查看全部选项</div>
            </div>
          )}
          <div className="text-[#999999]">
            {totalVotes}人参与 还有{(secondsToExpire / 3600).toFixed(2)}小时结束
          </div>
        </div>
      )}
    </div>
  )
}

function SubscribeCard({ user }: { user: User }) {
  const { back_img, photo, id, first_name, last_name, username } = user
  return (
    <div
      className="w-full rounded-lg bg-cover h-[100px]"
      style={{
        backgroundImage: `url(${buildFileUrl(back_img)})`
      }}
    >
      <div className="w-full h-full flex justify-between bg-black/50 p-3 rounded-lg">
        <div className="flex gap-4 px-3 items-center">
          <div>
            <Avatar fileId={photo} width={24} />
          </div>
          <div className="text-white">
            <div className="text-lg">
              {first_name} {last_name}
            </div>
            <div className="text-white/75 text-xs">
              {buildMention(username)}
            </div>
          </div>
        </div>
        <SubscribedDrawer name={first_name} userId={Number(id)}>
          <button className="bg-black/50 text-white text-xs self-start px-1 py-1 rounded-lg">
            免费/订阅
          </button>
        </SubscribedDrawer>
      </div>
    </div>
  )
}

function UserTitle({ user }: { user: User }) {
  const { photo, first_name, last_name, username } = user
  return (
    <div className="flex gap-4 px-3">
      <div>
        <Avatar fileId={photo} />
      </div>
      <div>
        <div className="text-lg">
          {first_name} {last_name}
        </div>
        <div className="text-black/50 text-xs">{buildMention(username)}</div>
      </div>
    </div>
  )
}

function Avatar({ fileId, width = 16 }: { fileId: string; width?: number }) {
  return (
    <Image
      src={buildFileUrl(fileId)}
      alt=""
      className={`rounded-full border-2 border-white w-${width} h-${width}`}
      width={50}
      height={50}
    />
  )
}

function Description({ content }: { content: string }) {
  const mentionRegex = /(\B@\w+)/g
  const segments = content.split(mentionRegex)
  return (
    <div className="px-3">
      {segments.map((s, i) => (
        <DescriptionSegment key={i} content={s} />
      ))}
    </div>
  )
}

function DescriptionSegment({ content }: { content: string }) {
  return isMention(content) ? (
    <Link
      href={buildUserHomePagePath(getUserIdFromMention(content))}
      className="text-[#FF8492]"
    >
      {content}{" "}
    </Link>
  ) : (
    <span>{content} </span>
  )
}

function Media({ data }: { data: Attachment[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map(({ file_id, file_type, thumb_id }, i) => (
        <Thumbnail
          key={i}
          largeElement={
            file_type === FileType.Video ? (
              <video
                src={buildFileUrl(file_id)}
                controls
                autoPlay
                className="w-full"
              />
            ) : (
              <Image
                className="w-full"
                src={buildFileUrl(file_id)}
                alt=""
                width={900}
                height={500}
              />
            )
          }
          thumbnailElement={
            file_type === FileType.Video ? (
              <div
                className="aspect-square flex justify-center items-center bg-cover rounded-md"
                style={{
                  backgroundImage: `url(${buildFileUrl(thumb_id)})`
                }}
              >
                <div className="bg-black/50 w-12 h-12 rounded-full flex justify-center items-center">
                  <Image
                    src="/icons/play.png"
                    width={20}
                    height={20}
                    alt="play"
                  />
                </div>
              </div>
            ) : (
              <Image
                className="aspect-square rounded-md"
                src={buildFileUrl(file_id)}
                alt=""
                width={200}
                height={200}
              />
            )
          }
        />
      ))}
    </div>
  )
}

function Thumbnail({
  largeElement,
  thumbnailElement
}: {
  largeElement: ReactElement
  thumbnailElement: ReactElement
}) {
  const [showLarge, setShowLarge] = useState(false)

  return (
    <div>
      {showLarge ? (
        <FullScreen onExit={() => setShowLarge(false)}>
          {largeElement}
        </FullScreen>
      ) : (
        <div onClick={() => setShowLarge(true)}>{thumbnailElement}</div>
      )}
    </div>
  )
}

function FullScreen({
  children,
  onExit
}: {
  children: ReactElement
  onExit: () => void
}) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/90 z-50 flex items-center"
      onClick={handleClick}
    >
      {children}
    </div>
  )

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    if (e.target === e.currentTarget) {
      onExit()
    }
  }
}

function UserHomePageLink({ userId }: { userId: string }) {
  return (
    <Link href={buildUserHomePagePath(userId)} className="px-3 text-[#FF8492]">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  )
}

function Like({ count, liked, postId }: { count: number; liked: boolean, postId: number }) {
  // 添加点赞状态
  const [likes, setLikes] = useState(count)
  const [isLiked, setIsLiked] = useState(liked)

  const handleLike = async () => {
    if (isLiked) {
      // 如果已经点赞，取消点赞
      setLikes(prevLikes => prevLikes - 1)
      setIsLiked(false)
    } else {
      // 如果未点赞，增加点赞
      setLikes(prevLikes => prevLikes + 1)
      setIsLiked(true)
    }
    // 静默提交点赞操作
    try {
      await starPost({ post_id: postId, deleted: !isLiked })
    } catch (error) {
      console.error("Error liking post:", error)
      // 如果点赞失败，恢复之前的点赞状态
      setLikes(prevLikes => (isLiked ? prevLikes + 1 : prevLikes - 1))
      setIsLiked(isLiked)
    }
  }
  return (
    <button onClick={() => {
      handleLike()
    }}
    >
      <Stats icon="icon_fans_like" value={likes} highlight={isLiked}/>
    </button>
  )
}

function CommentStats({ count }: { count: number }) {
  return (
    <button onClick={() => {}}>
      <Stats icon="icon_fans_comment" value={count} />
    </button>
  )
}

function Tip({ userId, count }: { userId: number; count: number }) {
  return (
    <Link
      scroll={false}
      href={`/explore/tip/${userId}`}
      className="flex items-center"
    >
      <Stats icon="icon_fans_reward" value={count} />
    </Link>
  )
}

const shareBtn = async (postId: number) => {
  await postSharLog({ post_id: postId })
}

function Share({ count, postId }: { count: number; postId: number }) {
  return (
    <button
      onClick={() => {
        shareBtn(postId)
      }}
    >
      <Stats icon="icon_fans_share" value={count} />
    </button>
  )
}

function Save({ count, saved, postId }: { count: number; saved: boolean, postId: number }) {
  const [saves, setSaves] = useState(count)
  const [isSaved, setIsSaved] = useState(saved)

  const handleSave = async () => {
    if (isSaved) {
      setSaves(prevLikes => prevLikes - 1)
      setIsSaved(false)
    } else {
      // 如果未点赞，增加点赞
      setSaves(prevLikes => prevLikes + 1)
      setIsSaved(true)
    }
    try {
      await userCollectionPost({ post_id: postId, collection: !isSaved, user_id: 1 })
    } catch (error) {
      console.error("Error saved post:", error)
      // 如果点赞失败，恢复之前的点赞状态
      setSaves(prevLikes => (isSaved ? prevLikes + 1 : prevLikes - 1))
      setIsSaved(isSaved)
    }
  }
  return (
    <button onClick={() => {
      handleSave()
    }}
    >
      <Stats icon="icon_fans_collect" value={saves} highlight={isSaved}/>
    </button>
  )
}

function Stats({
  icon,
  value,
  highlight = false
}: {
  icon: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className={`flex gap-1 items-center ${highlight && "text-[#FF8492]"}`}>
      <Image
        src={
          highlight
            ? "/icons/" + icon + "_highlight@3x.png"
            : "/icons/" + icon + "_normal@3x.png"
        }
        width={20}
        height={20}
        alt=""
      />
      <span className="text-xs">{value}</span>
    </div>
  )
}

function buildFileUrl(fileId: string) {
  return `https://imfanstest.potato.im/api/v1/media/img/${fileId}`
}
