import { MediaType, PostData } from "./type"

const videoSrc =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

const imageSrc = "/mock/avatar.jpg"

const backgroundSrc = "/mock/usercard-background.jpg"

export const postData: PostData = {
  id: "123",
  poster: {
    name: "Jamie Shon",
    id: "jamieshon",
    avatar: imageSrc,
    background: backgroundSrc,
  },
  description:
    "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo 带您踏上文化之旅，展示韩国烧烤、香草护肤品、各种泡菜等等！您一定想错过这个充满动感的剧集！",
  media: [
    {
      type: MediaType.Image,
      src: imageSrc,
      thumbnail: imageSrc,
    },
    {
      type: MediaType.Image,
      src: imageSrc,
      thumbnail: imageSrc,
    },
    {
      type: MediaType.Image,
      src: imageSrc,
      thumbnail: imageSrc,
    },
    {
      type: MediaType.Image,
      src: imageSrc,
      thumbnail: imageSrc,
    },
    {
      type: MediaType.Image,
      src: imageSrc,
      thumbnail: imageSrc,
    },
    {
      type: MediaType.Video,
      thumbnail: "/mock/video-preview.jpg",
      src: videoSrc,
    },
    {
      type: MediaType.Video,
      thumbnail: "/mock/video-preview.jpg",
      src: videoSrc,
    },
    {
      type: MediaType.Video,
      thumbnail: "/mock/video-preview.jpg",
      src: videoSrc,
    },
    {
      type: MediaType.Video,
      thumbnail: "/mock/video-preview.jpg",
      src: videoSrc,
    },
  ],
  subscribe: [
    {
      name: "Jamie Shon",
      id: "jamieshon",
      avatar: imageSrc,
      background: backgroundSrc,
    },
  ],
  vote: {
    options: [
      {
        name: "选项1",
        votes: 999,
      },
      {
        name: "选项2",
        votes: 999,
      },
      {
        name: "选项3",
        votes: 999,
      },
      {
        name: "选项4",
        votes: 999,
      },
    ],
  },
  like: { count: 999, liked: true },
  share: { count: 999, shared: false },
  save: { count: 999, saved: true },
  tip: { count: 999 },
  comment: { count: 999 },
}
