import { FileType } from "./type"
import { PostData } from "@/lib"

const photo = "5902a7d0-8561-4cfb-8f58-e767e9b2e04f"
const back_img = "63b4312b-932b-409c-9339-fff685514fdc"
const first_name = "Jamie"
const last_name = "Shon"
const username = "jamieshon"
const commentContent =
  "这个产品我用过，超级好用。这个产品我用过，超级好用。这个产品我用过，超级好用。"

export function getMockPostData(): PostData {
  return {
    collection: true,
    star: true,
    mention_user: [
      {
        back_img,
        first_name,
        id: 1,
        last_name,
        photo,
        username,
        sub: false
      }
    ],
    post: {
      id: 1,
      title:
        "Jamie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon @luvjamxoxo 带您踏上文化之旅，展示韩国烧烤、香草护肤品、各种泡菜等等！您一定想错过这个充满动感的剧集！"
    },
    post_attachment: [
      {
        file_id: photo,
        file_type: FileType.Image,
        thumb_id: photo
      },
      {
        file_id: photo,
        file_type: FileType.Image,
        thumb_id: photo
      }
    ],
    post_metric: {
      collection_count: 2,
      comment_count: 4,
      share_count: 6,
      thumbs_up_count: 9,
      tip_count: 55
    },
    post_vote: {
      items: [
        {
          content: "选项0",
          id: 0,
          vote_count: 0
        },
        {
          content: "选项1",
          id: 1,
          vote_count: 1
        }
      ],
      title: "投票名称",
      stop_time: 1724317440
    },
    user: {
      back_img,
      first_name,
      id: 0,
      last_name,
      photo,
      username,
      sub: false
    },
    comments: [
      {
        content: commentContent,
        id: 0,
        reply_arr: [
          {
            content: commentContent,
            id: 0,
            thumbs_up_count: 3,
            user: {
              back_img,
              first_name,
              id: 0,
              last_name,
              photo,
              username,
              sub: false
            }
          }
        ],
        reply_count: 1,
        thumbs_up_count: 2,
        user: {
          back_img,
          first_name,
          id: 0,
          last_name,
          photo,
          username,
          sub: false
        }
      }
    ]
  }
}
