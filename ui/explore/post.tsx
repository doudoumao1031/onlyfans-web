import Image from "next/image";

export default function Post({ data }) {
  const { poster, description, video, mentioned, stats } = data;

  return (
    <div>
      <div>
        <div>
          <Image src={poster.profileImage} />
        </div>
        <div>
          <div>{poster.name}</div>
          <div>{poster.id}</div>
        </div>
      </div>
      <div>{description}</div>
      <div>{poster.link}</div>
      <div>
        <video src={video.src} />
      </div>
      <div>
        {mentioned.map((m) => (
          <div key={m.id}>{m}</div>
        ))}
      </div>
      <div>
        <div>
          <div>icon</div>
          <div>number</div>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export const fakePostData = {
  poster: {
    name: "Jamie Shon",
    id: "@jamieshon",
    profileImage: "",
    url: "",
  },
  description:
    "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo 带您踏上文化之旅，展示韩国烧烤、香草护肤品、各种泡菜等等！您一定想错过这个充满动感的剧集！",
  video: { src: "" },
  mentioned: [
    {
      name: "Jamie Shon",
      id: "@jamieshon",
      profileImage: "",
      url: "",
    },
  ],
  stats: {
    likes: 99,
    comments: 99,
    shared: 99,
    saved: 99,
  },
};
