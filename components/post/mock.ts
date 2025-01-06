import { MediaType, PostData } from "./type"

const video =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
const avatar = "/mock/avatar.jpg"
const background = "/mock/usercard-background.jpg"
const userName = "Jamie Shon"
const commentContent =
  "这个产品我用过，超级好用。这个产品我用过，超级好用。这个产品我用过，超级好用。"
const commentTime = "12月22日 22:22"

export function getPostData(): PostData {
  return {
    id: "123",
    poster: {
      name: userName,
      id: "jamieshon",
      avatar,
      background,
    },
    description:
      "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo 带您踏上文化之旅，展示韩国烧烤、香草护肤品、各种泡菜等等！您一定想错过这个充满动感的剧集！",
    media: [
      {
        type: MediaType.Image,
        src: avatar,
        thumbnail: avatar,
      },
      {
        type: MediaType.Image,
        src: avatar,
        thumbnail: avatar,
      },
      {
        type: MediaType.Image,
        src: avatar,
        thumbnail: avatar,
      },
      {
        type: MediaType.Image,
        src: avatar,
        thumbnail: avatar,
      },
      {
        type: MediaType.Image,
        src: avatar,
        thumbnail: avatar,
      },
      {
        type: MediaType.Video,
        thumbnail: "/mock/video-preview.jpg",
        src: video,
      },
      {
        type: MediaType.Video,
        thumbnail: "/mock/video-preview.jpg",
        src: video,
      },
      {
        type: MediaType.Video,
        thumbnail: "/mock/video-preview.jpg",
        src: video,
      },
      {
        type: MediaType.Video,
        thumbnail: "/mock/video-preview.jpg",
        src: video,
      },
    ],
    subscribe: [
      {
        name: userName,
        id: "1",
        avatar,
        background,
      },
    ],
    vote: {
      name: "投票标题",
      complete: getRandomInt(2) === 0,
      participantAmount: 89,
      hoursToEnd: 3,
      options: [
        {
          name: "选项1",
          votes: 10,
        },
        {
          name: "选项2",
          votes: 5,
        },
        {
          name: "选项3",
          votes: 1,
        },
        {
          name: "选项4",
          votes: 0,
        },
      ],
    },
    likedAmount: 999,
    likedByMe: true,
    sharedAmount: 999,
    sharedByMe: false,
    savedAmount: 999,
    savedByMe: true,
    tippedAmount: 999,
    tippedByMe: false,
    commentAmount: 99,
    commentedByMe: true,
    comments: [
      {
        userName,
        avatar,
        content: commentContent,
        likes: 99,
        time: commentTime,
        replies: [
          {
            userName,
            avatar,
            content: commentContent,
            likes: 99,
            time: commentTime,
            replies: [],
          },
          {
            userName,
            avatar,
            content: commentContent,
            likes: 99,
            time: commentTime,
            replies: [],
          },
        ],
      },
      {
        userName,
        avatar,
        content: commentContent,
        likes: 99,
        time: commentTime,
        replies: [
          {
            userName,
            avatar,
            content: commentContent,
            likes: 99,
            time: commentTime,
            replies: [],
          },
        ],
      },
    ],
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}
