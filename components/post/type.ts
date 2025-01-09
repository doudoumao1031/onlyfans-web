export interface PostData {
  collection: boolean
  star: boolean
  mention_user: User[]
  post: {
    id: number
    title: string
  }
  post_attachment: Attachment[]
  post_metric: {
    collection_count: number
    comment_count: number
    share_count: number
    thumbs_up_count: number
    tip_count: number
  }
  post_vote: Vote
  user: User
  comments: Comment[]
}
export interface Comment {
  content: string
  id: number
  reply_arr?: Comment[]
  reply_count?: number
  thumbs_up_count: number
  user: User
}
export interface Vote {
  items: VoteItem[]
  title: string
  stop_time: number
}
export interface VoteItem {
  content: string
  id: number
  vote_count: number
}
export interface Attachment {
  file_id: string
  file_type: FileType
  thumb_id: string
}

export enum FileType {
  Image = 1,
  Video = 2,
  Other = 3,
}
export interface User {
  back_img: string
  first_name: string
  id: number
  last_name: string
  photo: string
  username: string
}
