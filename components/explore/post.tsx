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
      <div className="flex gap-4">
        <Action name="likes" />
        <Action name="comments" />
        <Action name="shared" />
        <Action name="saved" />
      </div>
    </div>
  );
}

function SubscribeUser({ user }) {
  return (
    <div className="bg-amber-300 rounded-lg flex justify-between px-3 py-3">
      <UserProfile user={user} />
      <button className="bg-white self-start">Subscribe</button>
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

function Action({ name }) {
  return (
    <div className="flex gap-1">
      <button className="bg-neutral-300">{name}</button>
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
    <div className="flex justify-center" onClick={handleClick}>
      <video src={src} ref={ref} className="w-full rounded-lg" />
      {!isPlaying && (
        <button className="absolute self-center bg-white w-16 h-8">Play</button>
      )}
    </div>
  );

  function handleClick() {
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
