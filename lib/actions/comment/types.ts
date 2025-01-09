// Comment related types and interfaces

export interface CommentReq {
  postId: string
  content: string
  replyUserId?: string
}

export interface CommentReplyReq {
  postId: string
  commentId: string
  content: string
  replyUserId: string
}

export interface CommentUpVo {
  commentId: string
  up: boolean
}

export interface CommentDelReq {
  commentId: string
}

export interface CommentPageReq {
  postId: string
  page: number
  limit: number
}

export interface CommentReplayPageReq {
  commentId: string
  page: number
  limit: number
}

export interface CommentInfo {
  id: string
  postId: string
  userId: string
  content: string
  upCount: number
  replyCount: number
  isUp: boolean
  createdAt: string
  user: {
    id: string
    username: string
    name: string
    photoUrl?: string
  }
}

export interface CommentReplyInfo {
  id: string
  commentId: string
  userId: string
  content: string
  replyUserId: string
  createdAt: string
  user: {
    id: string
    username: string
    name: string
    photoUrl?: string
  }
  replyUser: {
    id: string
    username: string
    name: string
    photoUrl?: string
  }
}
