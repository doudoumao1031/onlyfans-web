"use client"

import React, { ReactElement, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Post({ data }: { data: PostData }) {
  const {
    poster,
    description,
    media,
    subscribe,
    likeCount,
    commentCount,
    tipCount,
    shareCount,
    saveCount,
  } = data

  return (
    <div className="w-full flex flex-col gap-2 border-b border-black/5">
      <UserTitle user={poster} />
      <Description text={description} />
      <UserHomePageLink userId={poster.id} />
      <Media data={media} />
      <div className="">
        {subscribe.map((user) => (
          <SubscribeCard key={user.id} user={user} />
        ))}
      </div>
      <div className="flex gap-4 justify-between opacity-30 pt-4 pb-6">
        <Like count={likeCount} />
        <Comment count={commentCount} />
        <Tip user={poster} count={tipCount} />
        <Share count={shareCount} />
        <Save count={saveCount} />
      </div>
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
            <div className="text-white/75 text-xs">@{user.id}</div>
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
        <div className="text-black/50 text-xs">@{user.id}</div>
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

function Description({ text }: { text: string }) {
  const words = text.split(" ")
  return (
    <div className="px-3">
      {words.map((w, i) => (
        <Word key={i} word={w} />
      ))}
    </div>
  )
}

function Word({ word }: { word: string }) {
  return isMention(word) ? (
    <Link
      href={buildUserHomePagePath(getUserIdFromMention(word))}
      className="text-sky-400"
    >
      {word}{" "}
    </Link>
  ) : (
    <span>{word} </span>
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
    e.preventDefault()
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

function Like({ count }: { count: number }) {
  return <Stats icon="/icons/like.png" value={count} />
}

function Comment({ count }: { count: number }) {
  return <Stats icon="/icons/comment.png" value={count} />
}

function Tip({ user, count }: { user: User; count: number }) {
  return (
    <Link href={`/tip/${user.id}`} className="flex items-center">
      <Stats icon="/icons/tip.png" value={count} />
    </Link>
  )
}

function Share({ count }: { count: number }) {
  return <Stats icon="/icons/share.png" value={count} />
}

function Save({ count }: { count: number }) {
  return <Stats icon="/icons/save.png" value={count} />
}

function Stats({ icon, value }: { icon: string; value: number }) {
  return (
    <div className="flex gap-1 items-center">
      <Image src={icon} width={20} height={20} alt="" />
      <span className="text-xs">{value}</span>
    </div>
  )
}

function buildUserHomePagePath(userId: string) {
  return `/${userId}`
}

function buildUserHomePagePathForDisplay(userId: string) {
  return `secretfans.com/${userId}`
}

function isMention(word: string) {
  return word.length > 1 && word.charAt(0) === "@"
}

function getUserIdFromMention(mention: string) {
  return mention.substring(1)
}

export interface PostData {
  id: string
  poster: User
  description: string
  media: (VideoData | ImageData)[]
  subscribe: User[]
  likeCount: number
  commentCount: number
  saveCount: number
  shareCount: number
  tipCount: number
}

interface User {
  id: string
  name: string
  avatar: string
  background: string
}

export enum MediaType {
  Video,
  Image,
}

interface VideoData {
  src: string
  thumbnail: string
  type: MediaType.Video
}

interface ImageData {
  src: string
  thumbnail: string
  type: MediaType.Image
}
