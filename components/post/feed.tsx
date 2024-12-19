"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface User {
  name: string;
  id: string;
  avatar: string;
  backgroundImage?: string;
}

interface Video {
  src: string;
  placeholder: string;
}

interface PostData {
  poster: User;
  description: string;
  video: Video;
  mentioned: User[];
  stats?: {
    likes: number;
    comments: number;
    shared: number;
    saved: number;
  };
}

interface FeedProps {
  data: PostData;
}

interface UserCardProps {
  user: User;
}

interface UserBriefProps {
  user: User;
}

interface ActionProps {
  name: string;
  iconName: string;
}

interface AvatarProps {
  src: string;
  width?: string;
}

interface DescriptionProps {
  text: string;
}

interface VideoProps {
  src: string;
  placeholder: string;
}

interface UserHomePageLinkProps {
  userId: string;
}

export default function Feed({ data }: FeedProps) {
  const { poster, description, video, mentioned } = data;

  return (
    <div className="w-full flex flex-col gap-2">
      <UserBrief user={poster} />
      <Description text={description} />
      <UserHomePageLink userId={poster.id} />
      <Video src={video.src} placeholder={video.placeholder} />
      <div className="px-3">
        {mentioned.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <div className="px-3 flex gap-4 justify-between opacity-30">
        <Action name="点赞" iconName="like" />
        <Action name="留言" iconName="comment" />
        <Link href={`/explore/tip/1`}>  
          <Action name="打赏" iconName="tip" />
        </Link>
        <Action name="分享" iconName="share" />
        <Action name="保存" iconName="save" />
      </div>
    </div>
  );
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex justify-center w-full bg-black rounded-lg">
      <Image
        src={user.backgroundImage || "/demo/user_bg.png"} 
        width={280}
        height={120}
        alt=""
        className="w-full rounded-lg opacity-50"
      />
      <div className="w-full absolute self-center flex justify-around">
        <div className="flex gap-4 px-3 items-center">
          <div>
            <Avatar src={user.avatar} width="w-24" />
          </div>
          <div className="text-white">
            <div>{user.name}</div>
            <div>@{user.id}</div>
          </div>
        </div>
        <button className="bg-black opacity-65 text-white text-xs self-start px-1 py-1 rounded-lg">
          免费/订阅
        </button>
      </div>
    </div>
  );
}

function UserBrief({ user }: UserBriefProps) {
  return (
    <div className="flex gap-4 px-3">
      <div>
        <Avatar src={user.avatar} />
      </div>
      <div>
        <div>{user.name}</div>
        <div>@{user.id}</div>
      </div>
    </div>
  );
}

function Action({ name, iconName }: ActionProps) {
  return (
    <div className="flex gap-1 items-center">
      <Image src={`/icons/${iconName}.png`} width={20} height={20} alt={name} />
      <span className="text-xs">{name}</span>
    </div>
  );
}

function Avatar({ src, width = "w-18" }: AvatarProps) {
  return (
    <Image
      src={src}
      alt="User avatar"
      className={`rounded-full border-2 border-white ${width}`}
      width={50}
      height={50}
    />
  );
}

function Description({ text }: DescriptionProps) {
  const words = text.split(" ");
  return (
    <div className="px-3">
      {words.map((w, i) => (
        <Word key={i} word={w} />
      ))}
    </div>
  );
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
  );
}

function Video({ src, placeholder }: VideoProps) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="w-full">
      {showVideo ? (
        <video src={src} className="w-full" controls autoPlay preload="none" />
      ) : (
        <div
          onTouchEnd={() => setShowVideo(true)}
          className="w-full flex justify-center"
        >
          <Image
            src={placeholder}
            width={320}
            height={180}
            alt="Video thumbnail"
            className="w-full"
          />
          <div className="absolute self-center bg-white opacity-75 w-20 h-20 rounded-full flex justify-center items-center">
            <Image src="/icons/play.png" width={40} height={40} alt="Play video" />
          </div>
        </div>
      )}
    </div>
  );
}

function UserHomePageLink({ userId }: UserHomePageLinkProps) {
  return (
    <Link href={buildUserHomePagePath(userId)} className="px-3 text-sky-400">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  );
}

function buildUserHomePagePath(userId: string) {
  return `/${userId}`;
}

function buildUserHomePagePathForDisplay(userId: string) {
  return `secretfans.com/${userId}`;
}

function isMention(word: string) {
  return word.length > 1 && word.charAt(0) === "@";
}

function getUserIdFromMention(mention: string) {
  return mention.substring(1);
}

export const fakePostData: PostData = {
  poster: {
    name: "Jamie Shon",
    id: "jamieshon",
    avatar: "/mock/avatar.jpg",
  },
  description:
    "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo 带您踏上文化之旅，展示韩国烧烤、香草护肤品、各种泡菜等等！您一定想错过这个充满动感的剧集！",
  video: {
    placeholder: "/mock/video-preview.jpg",
    src: "https://cdn2.onlyfans.com/files/c/cd/cde2b8e253806ace979d48cfe28d8343/0hvzbf835nlhf4y3o4cuk_source.mp4?Tag=2&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6XC9cL2NkbjIub25seWZhbnMuY29tXC9maWxlc1wvY1wvY2RcL2NkZTJiOGUyNTM4MDZhY2U5NzlkNDhjZmUyOGQ4MzQzXC8waHZ6YmY4MzVubGhmNHkzbzRjdWtfc291cmNlLm1wND9UYWc9MiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTczNDU2MDIzMX0sIklwQWRkcmVzcyI6eyJBV1M6U291cmNlSXAiOiIxMy4yMTQuMjMyLjIyMlwvMzIifX19XX0_&Signature=QebcUcZm1zi8EhLi17spfwaw9lKnlI-i75Fp5dpi9LhekAiSpsMTGvw~636LUj930PpGw~EXIWCgeoZyGCkmRDPdcZ3YpRHrxJxUvYWHCZ0eCcWgM6MHVe6mT42uK7r9U3pRlJsF2T~xwIjQ2AO7xB9uAqMls4thPPRDH5jQfi66j2MM7hTD040UXXRZR8C4GGVK-KSRx0jXxZtSztq-4zeFvIq-tKk24INxluqMivN5O8NLlL2T43QAdrJvxp3TDrUkWDIdVtXdnZrfwXkkl6BOhYCPjljebT2bXYYqFYcO~aG790y~5aeJs3SCHNQqTmdyn2orD4TySyWBWVAwew__&Key-Pair-Id=APKAUSX4CWPPATFK2DGD",
  },
  mentioned: [
    {
      name: "Jamie Shon",
      id: "jamieshon",
      avatar: "/mock/avatar.jpg",
      backgroundImage: "/mock/usercard-background.jpg",
    },
  ],
  stats: {
    likes: 99,
    comments: 99,
    shared: 99,
    saved: 99,
  },
};
