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
} from "./type"
import {
  isMention,
  buildUserHomePagePath,
  getUserIdFromMention,
  buildUserHomePagePathForDisplay,
  buildMention,
} from "./util"

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
    like,
    comment,
    tip,
    share,
    save,
    vote,
  } = data

  return (
    <div className="w-full flex flex-col gap-2 border-b border-black/5">
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
      <div className="flex gap-4 justify-between opacity-30 pt-4 pb-6">
        <Like count={like.count} liked={like.liked} />
        <Comment count={comment.count} />
        <Tip user={poster} count={tip.count} />
        <Share count={share.count} shared={share.shared} />
        <Save count={save.count} saved={save.saved} />
      </div>
    </div>
  )
}

function Vote({ data }: { data: VoteData }) {
  return (
    <div>
      {data.options.map(({ name, votes }, i) => (
        <div key={i}>
          <div>{name}</div>
          <div>{votes}</div>
        </div>
      ))}
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
            <Avatar src={user.avatar} width="w-24" />
          </div>
          <div className="text-white">
            <div className="text-lg">{user.name}</div>
            <div className="text-white/75 text-xs">{buildMention(user.id)}</div>
          </div>
        </div>
        <button className="bg-black opacity-65 text-white text-xs self-start px-1 py-1 rounded-lg">
          免费/订阅
        </button>
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

function Avatar({ src, width = "w-18" }: { src: string; width?: string }) {
  return (
    <Image
      src={src}
      alt=""
      className={`rounded-full border-2 border-white ${width}`}
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
                <div className="bg-black/50 w-10 h-10 rounded-full flex justify-center items-center">
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
        <div onTouchEnd={() => setShowLarge(true)}>{thumbnailElement}</div>
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
      onTouchEnd={handleTouch}
    >
      {children}
    </div>
  )

  function handleTouch(e: React.TouchEvent) {
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

function Comment({ count }: { count: number }) {
  return <Stats icon="/icons/comment.png" value={count} />
}

function Tip({ user, count }: { user: User; count: number }) {
  return (
    <Link href={`/explore/tip/${user.id}`} className="flex items-center">
      <Stats icon="/icons/tip.png" value={count} />
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
