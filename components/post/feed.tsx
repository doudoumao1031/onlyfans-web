"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Feed({ data }) {
  const { poster, description, video, subscribe } = data;

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

function SubscribeCard({ user }) {
  return (
    <div
      className="flex justify-center items-center w-full h-32 bg-black rounded-lg bg-cover"
      style={{
        backgroundImage: `url(${user.backgroundImage})`,
      }}
    >
      <div className="w-full flex justify-around">
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

function UserTitle({ user }) {
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

function Action({ name, iconName }) {
  return (
    <div className="flex gap-1 items-center">
      <Image src={`/icons/${iconName}.png`} width={20} height={20} alt={name} />
      <span className="text-xs">{name}</span>
    </div>
  );
}

function Avatar({ src, width = "w-18" }) {
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

function Description({ text }) {
  const words = text.split(" ");
  return (
    <div className="px-3">
      {words.map((w, i) => (
        <Word key={i} word={w} />
      ))}
    </div>
  );
}

function Word({ word }) {
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

function Video({ src, placeholder }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="w-full rounded-lg">
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
          <div className="bg-white opacity-75 w-20 h-20 rounded-full flex justify-center items-center">
            <Image src="/icons/play.png" width={40} height={40} alt="play" />
          </div>
        </div>
      )}
    </div>
  );
}

function UserHomePageLink({ userId }) {
  return (
    <Link href={buildUserHomePagePath(userId)} className="px-3 text-sky-400">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  );
}

function buildUserHomePagePath(userId) {
  return `/${userId}`;
}

function buildUserHomePagePathForDisplay(userId) {
  return `secretfans.com/${userId}`;
}

function isMention(word) {
  return word.length > 1 && word.charAt(0) === "@";
}

function getUserIdFromMention(mention) {
  return mention.substring(1);
}

export const fakePostData = {
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
