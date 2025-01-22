import Image from "next/image"
import Avatar from "./avatar"
import {
  addComment,
  CommentInfo,
  CommentReplyReq,
  deleteComment,
  fetchCommentReplies,
  fetchPostComments,
  replyComment,
  upComment
} from "@/lib"
import { useEffect, useState } from "react"

export default function Comments({ post_id }: { post_id: number }) {
  const [comments, setComments] = useState<CommentInfo[]>([])
  const [input, setInput] = useState("")
  const [replies, setReplies] = useState<{
    [commendId: number]: { show: boolean; replies: CommentInfo[] }
  }>({})

  useEffect(() => {
    fetchComments()
    async function fetchComments() {
      setComments(await fetchPostComments(post_id))
    }
  }, [post_id])

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="grow"
          placeholder="发表评论,文明发言"
        />
        <button onClick={sendComment}>发送评论</button>
      </div>
      {comments.map((comment) => (
        <div key={comment.id} className="flex flex-col gap-4">
          <Comment
            comment={comment}
            refreshComments={refreshComments}
            showReplies={async () => {
              if (replies[comment.id]?.show) {
                setReplies({ ...replies, [comment.id]: { ...replies[comment.id], show: false } })
              } else {
                const repliesFetched = await fetchCommentReplies(comment.id, post_id)
                if (repliesFetched && repliesFetched.length) {
                  setReplies({ ...replies, [comment.id]: { show: true, replies: repliesFetched } })
                }
              }
            }}
          />
          {replies[comment.id]?.show && (
            <div className="pl-11 flex flex-col gap-2">
              {replies[comment.id].replies.map((reply) => (
                <Comment
                  comment={{ ...reply, post_id, reply_arr: [], reply_count: 0 }}
                  key={reply.id}
                  refreshComments={refreshComments}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  async function refreshComments() {
    setComments(await fetchPostComments(post_id))
  }

  async function sendComment() {
    const success = await addComment({ post_id, content: input })
    if (success) {
      setComments(await fetchPostComments(post_id))
      setInput("")
    }
  }
}

function Comment({
  comment,
  refreshComments,
  isReply = false,
  showReplies = () => {}
}: {
  comment: CommentInfo
  refreshComments: () => void
  isReply?: boolean
  showReplies?: () => void
}) {
  const {
    user,
    content,
    thumbs_up_count,
    thumb_up,
    id,
    comment_id,
    post_id,
    is_self,
    reply_count
  } = comment
  const { photo, username } = user
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyInput, setReplyInput] = useState("")
  const [thumbupCount, setThumbupCount] = useState(thumbs_up_count)
  const [isThumbupped, setIsThumbupped] = useState(thumb_up)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Avatar fileId={photo} width={9} />
          <div className="flex flex-col gap-1">
            <div className="text-xs text-[#FF8492]">{username}</div>
            <div className="text-sm">{content}</div>
            <div className="flex gap-4 text-xs text-[#6D7781]">
              {reply_count > 0 && (
                <div onClick={showReplies} className="text-[#FF8492]">
                  {reply_count}条回复
                </div>
              )}
              <div onClick={() => setShowReplyInput(!showReplyInput)}>回复</div>
              {is_self && <div onClick={removeComment}>删除</div>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center ml-2" onClick={thumbup}>
          <Image
            src={`${isThumbupped ? "/icons/thumbup_active.png" : "/icons/thumbup.png"}`}
            width={20}
            height={20}
            alt=""
            className="max-w-4"
          />
          <div className={`text-[10px] ${isThumbupped ? "text-[#FF8492]" : "text-[#6D7781]"}`}>
            {thumbupCount}
          </div>
        </div>
      </div>
      {showReplyInput && (
        <div className="flex gap-2 p-4">
          <input
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            className="grow"
            placeholder="发表回复,文明发言"
          />
          <button onClick={sendReply}>发送回复</button>
        </div>
      )}
    </div>
  )

  async function removeComment() {
    const success = await deleteComment({
      id,
      post_id,
      comment_type: !isReply
    })
    if (success) {
      refreshComments()
    }
  }

  async function thumbup() {
    toggleThumbup()

    const success = await upComment({
      comment_id: id,
      post_id,
      comment_type: !isReply
    })

    if (!success) {
      toggleThumbup()
    }
  }

  function toggleThumbup() {
    if (isThumbupped) {
      setIsThumbupped(false)
      setThumbupCount((pre) => pre - 1)
    } else {
      setIsThumbupped(true)
      setThumbupCount((pre) => pre + 1)
    }
  }

  async function sendReply() {
    const params: CommentReplyReq = {
      comment_id: id,
      content: replyInput
    }
    if (isReply) params.parent_reply_id = comment_id
    const success = await replyComment(params)
    if (success) {
      await refreshComments()
      setShowReplyInput(false)
      setReplyInput("")
    }
  }
}
