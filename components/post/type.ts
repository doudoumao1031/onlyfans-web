export interface PostData {
  id: string
  poster: User
  description: string
  media: (VideoData | ImageData)[]
  subscribe: User[]
  likedAmount: number
  likedByMe: boolean
  savedAmount: number
  savedByMe: boolean
  sharedAmount: number
  sharedByMe: boolean
  tippedAmount: number
  tippedByMe: boolean
  commentAmount: number
  commentedByMe: boolean
  comments: Comment[]
  vote?: Vote
}

export interface Comment {
  userName: string
  avatar: string
  content: string
  time: string
  likes: number
  replies: Comment[]
}

export interface User {
  id: string
  name: string
  avatar: string
  background: string
}

export enum MediaType {
  Video,
  Image,
}

export interface VideoData {
  src: string
  thumbnail: string
  type: MediaType.Video
}

export interface ImageData {
  src: string
  thumbnail: string
  type: MediaType.Image
}

export interface Vote {
  name: string
  complete: boolean
  options: VoteOption[]
  participantAmount: number
  hoursToEnd: number
}

export interface VoteOption {
  name: string
  votes: number
}
