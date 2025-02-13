import Image from "next/image"
import Avatar from "./avatar"
import {
  addComment,
  CommentInfo,
  CommentReplyInfo,
  CommentReplyReq,
  deleteComment,
  fetchCommentReplies,
  replyComment,
  upComment
} from "@/lib"
import { useState } from "react"

export default function Comments({
  post_id,
  comments,
  removeComment,
  fetchComments
}: {
  post_id: number
  comments: CommentInfo[]
  removeComment: (id: number) => void
  fetchComments: () => void
}) {
  const [input, setInput] = useState("")

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
        <Comment key={comment.id} comment={comment} removed={removeComment} />
      ))}
    </div>
  )

  async function sendComment() {
    const success = await addComment({ post_id, content: input })
    if (success) {
      fetchComments()
      setInput("")
    }
  }
}

function Comment({
  comment,
  removed
}: {
  comment: CommentInfo
  removed: (comment_id: number) => void
}) {
  const { user, content, thumbs_up_count, thumb_up, id, post_id, is_self, reply_count } = comment
  const { photo, username } = user
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyInput, setReplyInput] = useState("")
  const [thumbupCount, setThumbupCount] = useState(thumbs_up_count)
  const [isThumbupped, setIsThumbupped] = useState(thumb_up)
  const [replies, setReplies] = useState<CommentReplyInfo[] | undefined>(undefined)
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Avatar fileId={photo} width={9} />
          <div className="flex flex-col gap-2">
            <div className="text-xs text-[#FF8492]">{username}</div>
            <div className="text-sm">{content}</div>
            <div className="flex gap-4 text-xs text-[#6D7781]">
              {reply_count > 0 && (
                <div onClick={toggleReplies} className="text-[#FF8492]">
                  {reply_count}条回复
                </div>
              )}
              <div onClick={() => setShowReplyInput(!showReplyInput)}>回复</div>
              {is_self && <div onClick={removeComment}>删除</div>}
            </div>
          </div>
        </div>
        <Thumbup thumbupCount={thumbupCount} isThumbupped={isThumbupped} thumbup={thumbup} />
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
      {showReplies && replies?.length && (
        <div className="pl-10 py-4 flex flex-col gap-3">
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              post_id={post_id}
              removed={removeReply}
              fetchReplies={fetchReplies}
            />
          ))}
        </div>
      )}
    </div>
  )

  function removeReply(replyId: number) {
    setReplies(replies?.filter((r) => r.id !== replyId))
  }

  async function fetchReplies() {
    const replies = await fetchCommentReplies(id, post_id)
    if (replies.length) {
      setReplies(replies)
      setShowReplies(true)
    }
  }

  async function toggleReplies() {
    if (showReplies) {
      setShowReplies(false)
    } else {
      if (replies === undefined) {
        fetchReplies()
      } else {
        setShowReplies(true)
      }
    }
  }

  async function removeComment() {
    const success = await deleteComment({
      id,
      post_id,
      comment_type: true
    })
    if (success) {
      removed(id)
    }
  }

  async function thumbup() {
    toggleThumbup()

    const success = await upComment({
      comment_id: id,
      post_id,
      comment_type: true
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
    const success = await replyComment(params)
    if (success) {
      setShowReplyInput(false)
      setReplyInput("")
      fetchReplies()
    }
  }
}

function Reply({
  reply,
  post_id,
  removed,
  fetchReplies
}: {
  reply: CommentReplyInfo
  post_id: number
  removed: (replyId: number) => void
  fetchReplies: () => void
}) {
  const { user, content, thumbs_up_count, thumb_up, id, comment_id, is_self, reply_user } = reply
  const { photo, username } = user
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyInput, setReplyInput] = useState("")
  const [thumbupCount, setThumbupCount] = useState(thumbs_up_count)
  const [isThumbupped, setIsThumbupped] = useState(thumb_up)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Avatar fileId={photo} width={9} height={9} />
          <div className="flex flex-col gap-2">
            <div className="text-xs text-[#FF8492]">{username}</div>
            <div className="text-sm flex gap-2">
              {reply_user && <div className="text-[#6D7781]">{reply_user.username}</div>}
              <div>{content}</div>
            </div>
            <div className="flex gap-4 text-xs text-[#6D7781]">
              <div onClick={() => setShowReplyInput(!showReplyInput)}>回复</div>
              {is_self && <div onClick={removeReply}>删除</div>}
            </div>
          </div>
        </div>
        <Thumbup thumbupCount={thumbupCount} isThumbupped={isThumbupped} thumbup={thumbup} />
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

  async function sendReply() {
    const params: CommentReplyReq = {
      comment_id,
      content: replyInput,
      parent_reply_id: id
    }
    const success = await replyComment(params)
    if (success) {
      setShowReplyInput(false)
      setReplyInput("")
      fetchReplies()
    }
  }

  async function removeReply() {
    const success = await deleteComment({
      id,
      post_id,
      comment_type: false
    })
    if (success) {
      removed(id)
    }
  }

  async function thumbup() {
    toggleThumbup()

    const success = await upComment({
      comment_id: id,
      post_id,
      comment_type: false
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
}

function Thumbup({
  thumbupCount,
  isThumbupped,
  thumbup
}: {
  thumbupCount: number
  isThumbupped: boolean
  thumbup: () => void
}) {
  return (
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
  )
}
