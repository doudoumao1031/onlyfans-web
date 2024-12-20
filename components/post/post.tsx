"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Post({ data }: { data: PostData }) {
  const {
    poster,
    description,
    video,
    subscribe,
    likeCount,
    commentCount,
    tipCount,
    shareCount,
    saveCount,
  } = data;

  return (
    <div className="w-full flex flex-col gap-2 border-b border-black/5">
      <UserTitle user={poster} />
      <Description text={description} />
      <UserHomePageLink userId={poster.id} />
      <Video src={video.src} placeholder={video.placeholder} />
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
  );
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
  );
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
  );
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
  );
}

function Description({ text }: { text: string }) {
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

function Video({ src, placeholder }: { src: string; placeholder: string }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="w-full">
      {showVideo ? (
        <video
          src={src}
          className="w-full rounded-lg"
          controls
          autoPlay
          preload="none"
        />
      ) : (
        <div
          onTouchEnd={() => setShowVideo(true)}
          className="w-full flex justify-center items-center w-full h-48 bg-cover rounded-lg"
          style={{
            backgroundImage: `url(${placeholder})`,
          }}
        >
          <div className="bg-black/50 w-20 h-20 rounded-full flex justify-center items-center">
            <Image src="/icons/play.png" width={40} height={40} alt="play" />
          </div>
        </div>
      )}
    </div>
  );
}

function UserHomePageLink({ userId }: { userId: string }) {
  return (
    <Link href={buildUserHomePagePath(userId)} className="px-3 text-sky-400">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  );
}

function Like({ count }: { count: number }) {
  return <Stats icon="/icons/like.png" value={count} />;
}

function Comment({ count }: { count: number }) {
  return <Stats icon="/icons/comment.png" value={count} />;
}

function Tip({ user, count }: { user: User; count: number }) {
  return (
    <Link href={`/tip/${user.id}`} className="flex items-center">
      <Stats icon="/icons/tip.png" value={count} />
    </Link>
  );
}

function Share({ count }: { count: number }) {
  return <Stats icon="/icons/share.png" value={count} />;
}

function Save({ count }: { count: number }) {
  return <Stats icon="/icons/save.png" value={count} />;
}

function Stats({ icon, value }: { icon: string; value: number }) {
  return (
    <div className="flex gap-1 items-center">
      <Image src={icon} width={20} height={20} alt="" />
      <span className="text-xs">{value}</span>
    </div>
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

export const fakeData = {
  id: "123",
  poster: {
    name: "Jamie Shon",
    id: "jamieshon",
    avatar: "/mock/avatar.jpg",
  },
  description:
    "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo 带您踏上文化之旅，展示韩国烧烤、香草护肤品、各种泡菜等等！您一定想错过这个充满动感的剧集！",
  video: {
    placeholder: "/mock/video-preview.jpg",
    src: "https://cdn2.onlyfans.com/files/9/9d/9d411da609fa1fc0822f9f078e3f53aa/0hwpqw9hlk7lfm9esxbiv_720p.mp4?Tag=2&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6XC9cL2NkbjIub25seWZhbnMuY29tXC9maWxlc1wvOVwvOWRcLzlkNDExZGE2MDlmYTFmYzA4MjJmOWYwNzhlM2Y1M2FhXC8waHdwcXc5aGxrN2xmbTllc3hiaXZfNzIwcC5tcDQ~VGFnPTIiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MzQ2OTg1NjN9LCJJcEFkZHJlc3MiOnsiQVdTOlNvdXJjZUlwIjoiMTMuMjE0LjIzMi4yMjJcLzMyIn19fV19&Signature=RwXHHF5knvYyMoI2w9Sq73avdpN~5BXPPNNTIyksu8kDlkccaa3N0MjU0L-IZZRhGzccniKbsHYq6nDa-aur8zaZBQ80bMQTTb6RlvIDBblKsS~aipcggkm43i~1aWvZ1Ac5v5nb-an-mof4LL-0ukPK0Wp~HaCoOHR3o9aEeRAhWBGwjnHqvaU7QK3GhTQd6wisZEcsV0RQdykf5biJYfo~vDQZ-FdHdAdzWAYFWxXZCrKjglbuYqzdJiP47rYZPbtPpW4PqBBt0i7FJJGTuRlezUzKKsN~bKL9y-4Q-fFnYO2jcwLJk66FFNyqUbNmU~EUOzceaISQyVD09A9luw__&Key-Pair-Id=APKAUSX4CWPPATFK2DGD",
  },
  subscribe: [
    {
      name: "Jamie Shon",
      id: "jamieshon",
      avatar: "/mock/avatar.jpg",
      background: "/mock/usercard-background.jpg",
    },
  ],
  likeCount: 999,
  commentCount: 999,
  saveCount: 999,
  shareCount: 999,
  tipCount: 999,
};

interface PostData {
  id: string;
  poster: User;
  description: string;
  video: Video;
  subscribe: User[];
  likeCount: number;
  commentCount: number;
  saveCount: number;
  shareCount: number;
  tipCount: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  background: string;
}

interface Video {
  placeholder: string;
  src: string;
}
