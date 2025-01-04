"use client"

import React, { ReactElement, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MediaType,
  PostData,
  User,
  VideoData,
  ImageData,
  Vote as VoteData,
  Comment as CommentData,
} from "./type"
import {
  isMention,
  buildUserHomePagePath,
  getUserIdFromMention,
  buildUserHomePagePathForDisplay,
  buildMention,
} from "./util"
import SubscribedDrawer from "../explore/subscribed-drawer"

export default function Post({
  data,
  showSubscribe,
  showVote,
}: {
  data: PostData
  showSubscribe: boolean
  showVote: boolean
}) {
  const {
    poster,
    description,
    media,
    subscribe,
    likedAmount,
    likedByMe,
    commentAmount,
    commentedByMe,
    comments,
    tippedAmount,
    tippedByMe,
    sharedAmount,
    sharedByMe,
    savedAmount,
    savedByMe,
    vote,
  } = data

  return (
    <div className="w-full flex flex-col gap-2 mb-8">
      <UserTitle user={poster} />
      <Description content={description} />
      <UserHomePageLink userId={poster.id} />
      <Media data={media} />
      {showSubscribe && (
        <div>
          {subscribe.map((user) => (
            <SubscribeCard key={user.id} user={user} />
          ))}
        </div>
      )}
      {showVote && vote && <Vote data={vote} />}
      <div className="flex gap-4 justify-between opacity-30 pt-4 pb-6 border-b border-black/5">
        <Like count={likedAmount} liked={likedByMe} />
        <CommentStats count={commentAmount} commented={commentedByMe} />
        <Tip user={poster} count={tippedAmount} tipped={tippedByMe} />
        <Share count={sharedAmount} shared={sharedByMe} />
        <Save count={savedAmount} saved={savedByMe} />
      </div>
      <Comments comments={comments} />
    </div>
  )
}

function Comments({ comments }: { comments: CommentData[] }) {
  return (
    <div className="flex flex-col gap-4">
      {comments.map((c, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Comment comment={c} />
          {c.replies.length && (
            <div className="pl-11 flex flex-col gap-2">
              {c.replies.map((r, j) => (
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
  const { avatar, userName, content, likes, time } = comment
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Avatar src={avatar} width={10} />
        <div className="flex flex-col gap-1">
          <div className="text-xs text-[#FF8492]">{userName}</div>
          <div className="text-sm">{content}</div>
          <div className="flex gap-4 text-xs text-[#6D7781]">
            <div>{time}</div>
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
        <div className="text-[10px] text-[#6D7781]">{likes}</div>
      </div>
    </div>
  )
}

function Vote({ data }: { data: VoteData }) {
  const [showOptions, setShowOptions] = useState(false)
  const [showOptionAmount, setShowOptionAmount] = useState(3)
  const [selectedVoteIndex, setSelectedVoteIndex] = useState(-1)
  const totalVotes = data.options.reduce((t, o) => t + o.votes, 0)

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex gap-2 items-end"
        onClick={() => setShowOptions((pre) => !pre)}
      >
        <Image src="/icons/vote.png" alt="" width={20} height={20} />
        <div className="text-red-500 text-sm">{data.name}</div>
        {showOptions ? (
          <Image src="/icons/arrow_up.png" alt="" width={20} height={20} />
        ) : (
          <Image src="/icons/arrow_down.png" alt="" width={20} height={20} />
        )}
      </div>
      {showOptions && (
        <div className="flex flex-col gap-1">
          {data.options.slice(0, showOptionAmount).map(({ name, votes }, i) =>
            data.complete ? (
              <div
                key={i}
                className="w-full h-11 border rounded-md px-2 flex justify-between items-center bg-no-repeat"
                style={{
                  backgroundImage: `${
                    selectedVoteIndex === i
                      ? "url(/icons/pink.png)"
                      : "url(/icons/silver.png)"
                  }`,
                  backgroundSize: `${(votes / totalVotes) * 100}% 100%`,
                  borderColor: `${
                    selectedVoteIndex === i ? "#FF8492" : "#DDDDDD"
                  }`,
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
                  <div>{name}</div>
                </div>
                <div className="pr-3">{votes}票</div>
              </div>
            ) : (
              <div
                key={i}
                className="w-full h-11 border border-[#DDDDDD] rounded-md flex justify-center items-center"
              >
                <div>{name}</div>
              </div>
            )
          )}
          {showOptionAmount < data.options.length && (
            <div
              className="w-full h-11 border border-[#DDDDDD] rounded-md flex justify-center items-center"
              onClick={() => setShowOptionAmount(data.options.length)}
            >
              <div>查看全部选项</div>
            </div>
          )}
          <div className="text-[#999999]">
            {data.participantAmount}人参与 还有{data.hoursToEnd}小时结束
          </div>
        </div>
      )}
    </div>
  )
}

function SubscribeCard({ user }: { user: User }) {
  return (
    <div
      className="w-full rounded-lg bg-cover"
      style={{
        backgroundImage: `url(${user.background})`,
      }}
    >
      <div className="w-full h-full flex justify-between bg-black/50 p-3 rounded-lg">
        <div className="flex gap-4 px-3 items-center">
          <div>
            <Avatar src={user.avatar} width={24} />
          </div>
          <div className="text-white">
            <div className="text-lg">{user.name}</div>
            <div className="text-white/75 text-xs">{buildMention(user.id)}</div>
          </div>
        </div>
        <SubscribedDrawer name={user.name} userId={Number(user.id)}>
          <button className="bg-black bg-opacity-65 text-white text-xs self-start px-1 py-1 rounded-lg">
            免费/订阅
          </button>
        </SubscribedDrawer>
      </div>
    </div>
  )
}

function UserTitle({ user }: { user: User }) {
  return (
    <div className="flex gap-4 px-3">
      <div>
        <Avatar src={user.avatar} />
      </div>
      <div>
        <div className="text-lg">{user.name}</div>
        <div className="text-black/50 text-xs">{buildMention(user.id)}</div>
      </div>
    </div>
  )
}

function Avatar({ src, width = 16 }: { src: string; width?: number }) {
  return (
    <Image
      src={src}
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
      className="text-sky-400"
    >
      {content}{" "}
    </Link>
  ) : (
    <span>{content} </span>
  )
}

function Media({ data }: { data: (VideoData | ImageData)[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map(({ src, type, thumbnail }, i) => (
        <Thumbnail
          key={i}
          largeElement={
            type === MediaType.Video ? (
              <video src={src} controls autoPlay className="w-full" />
            ) : (
              <Image
                className="w-full"
                src={src}
                alt=""
                width={900}
                height={500}
              />
            )
          }
          thumbnailElement={
            type === MediaType.Video ? (
              <div
                className="aspect-square flex justify-center items-center bg-cover rounded-md"
                style={{
                  backgroundImage: `url(${thumbnail})`,
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
                src={thumbnail}
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
  thumbnailElement,
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
  onExit,
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
    <Link href={buildUserHomePagePath(userId)} className="px-3 text-sky-400">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  )
}

function Like({ count, liked }: { count: number; liked: boolean }) {
  return <Stats icon="/icons/like.png" value={count} highlight={liked} />
}

function CommentStats({
  count,
  commented,
}: {
  count: number
  commented: boolean
}) {
  return <Stats icon="/icons/comment.png" value={count} highlight={commented} />
}

function Tip({
  user,
  count,
  tipped,
}: {
  user: User
  count: number
  tipped: boolean
}) {
  return (
    <Link
      scroll={false}
      href={`/explore/tip/${user.id}`}
      className="flex items-center"
    >
      <Stats icon="/icons/tip.png" value={count} highlight={tipped} />
    </Link>
  )
}

function Share({ count, shared }: { count: number; shared: boolean }) {
  return <Stats icon="/icons/share.png" value={count} highlight={shared} />
}

function Save({ count, saved }: { count: number; saved: boolean }) {
  return <Stats icon="/icons/save.png" value={count} highlight={saved} />
}

function Stats({
  icon,
  value,
  highlight = false,
}: {
  icon: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className={`flex gap-1 items-center ${highlight && "text-red-500"}`}>
      <Image src={icon} width={20} height={20} alt="" />
      <span className="text-xs">{value}</span>
    </div>
  )
}
