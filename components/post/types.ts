export interface Vote {
  items: VoteItem[]
  title: string
  stop_time: number
  mu_select: boolean
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
  Other = 3
}
