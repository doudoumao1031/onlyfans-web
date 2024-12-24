export interface PostData {
  id: string
  poster: User
  description: string
  media: (VideoData | ImageData)[]
  subscribe: User[]
  like: { count: number; liked: boolean }
  share: { count: number; shared: boolean }
  save: { count: number; saved: boolean }
  tip: { count: number }
  comment: { count: number }
  vote?: Vote
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
  options: VoteOption[]
}

export interface VoteOption {
  name: string
  votes: number
}
