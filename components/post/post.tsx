"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Post({ data }) {
  const { poster, description, video, mentioned, stats } = data;

  return (
    <div className="w-full flex flex-col gap-4">
      <UserProfile user={poster} />
      <Description text={description} />
      <UserHomePageLink userId={poster.id} />
      <div>
        <Video src={video.src} />
      </div>
      <div>
        {mentioned.map((user) => (
          <SubscribeUser key={user.id} user={user} />
        ))}
      </div>
      <div className="flex gap-4 justify-between">
        <Action name="点赞" iconName="like" />
        <Action name="留言" iconName="comment" />
        <Action name="打赏" iconName="tip" />
        <Action name="分享" iconName="share" />
        <Action name="保存" iconName="save" />
      </div>
    </div>
  );
}

function SubscribeUser({ user }) {
  return (
    <div className="bg-amber-300 rounded-lg flex justify-between px-3 py-3">
      <UserProfile user={user} />
      <button className="bg-black text-white text-xs self-start px-1 py-1 rounded-lg">
        免费/订阅
      </button>
    </div>
  );
}

function UserProfile({ user }) {
  return (
    <div className="flex gap-4">
      <div>
        <ProfilePhoto src={user.profileImage} />
      </div>
      <div>
        <div>{user.name}</div>
        <div>@{user.id}</div>
      </div>
    </div>
  );
}

function Action({ name, iconName }) {
  return (
    <div className="flex gap-1 items-center">
      <Image
        src={`/icons/${iconName}.png`}
        width={20}
        height={20}
        alt={name}
        className="opacity-30"
      />
      <span className="text-xs">{name}</span>
    </div>
  );
}

function ProfilePhoto({ src }) {
  return (
    <Image
      src={src}
      alt=""
      className="rounded-full border-2 border-white"
      width={50}
      height={50}
    />
  );
}

function Description({ text }) {
  const words = text.split(" ");
  return (
    <div>
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

function Video({ src }) {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex justify-center" onTouchEnd={togglePlay}>
      <video src={src} ref={ref} className="w-full rounded-lg" />
      {!isPlaying && (
        <Image
          src="/icons/play.png"
          width={32}
          height={32}
          alt="play"
          className="absolute self-center bg-white opacity-75"
        />
      )}
    </div>
  );

  function togglePlay() {
    if (!ref.current) return;
    if (isPlaying) {
      ref.current.pause();
      setIsPlaying(false);
    } else {
      ref.current.play();
      setIsPlaying(true);
    }
  }
}

function UserHomePageLink({ userId }) {
  return (
    <Link href={buildUserHomePagePath(userId)} className="text-sky-400">
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
    profileImage: "https://randomuser.me/api/portraits/thumb/women/12.jpg",
  },
  description:
    "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo 带您踏上文化之旅，展示韩国烧烤、香草护肤品、各种泡菜等等！您一定想错过这个充满动感的剧集！",
  video: {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  },
  mentioned: [
    {
      name: "Jamie Shon",
      id: "jamieshon",
      profileImage: "https://randomuser.me/api/portraits/thumb/women/12.jpg",
    },
  ],
  stats: {
    likes: 99,
    comments: 99,
    shared: 99,
    saved: 99,
  },
};
