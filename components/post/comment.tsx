import Image from "next/image"
import Avatar from "./avatar"
import { addComment, CommentInfo, fetchPostComments, replyComment, upComment } from "@/lib"
import { useEffect, useState } from "react"

export default function Comments({ post_id }: { post_id: number }) {
  const [comments, setComments] = useState<CommentInfo[]>([])
  const [input, setInput] = useState("")

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
      {comments.map((comment, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Comment comment={comment} handleReplySucceed={handleReplySucceed} />
          {comment.reply_arr?.length && (
            <div className="pl-11 flex flex-col gap-2">
              {comment.reply_arr.map((reply, j) => (
                <Comment
                  comment={{ ...reply, post_id, reply_arr: [], reply_count: 0 }}
                  key={j}
                  handleReplySucceed={handleReplySucceed}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  async function handleReplySucceed() {
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
  handleReplySucceed
}: {
  comment: CommentInfo
  handleReplySucceed: () => void
}) {
  const { user, content, thumbs_up_count, id, post_id } = comment
  const { photo, username } = user
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyInput, setReplyInput] = useState("")

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Avatar fileId={photo} width={9} />
          <div className="flex flex-col gap-1">
            <div className="text-xs text-[#FF8492]">{username}</div>
            <div className="text-sm">{content}</div>
            <div className="flex gap-4 text-xs text-[#6D7781]">
              <div onClick={() => setShowReplyInput(!showReplyInput)}>回复</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center ml-2" onClick={upVoteComment}>
          <Image src="/icons/thumbup.png" width={20} height={20} alt="" className="max-w-4" />
          <div className="text-[10px] text-[#6D7781]">{thumbs_up_count}</div>
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

  async function upVoteComment() {
    const success = await upComment({
      comment_id: id,
      post_id
    })
    if (success) {
      handleReplySucceed()
    }
  }

  async function sendReply() {
    const success = await replyComment({
      comment_id: id,
      content: replyInput,
      parent_reply_id: id
    })
    if (success) {
      await handleReplySucceed()
      setShowReplyInput(false)
      setReplyInput("")
    }
  }
}
