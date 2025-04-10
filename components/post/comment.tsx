"use client"
import { useState } from "react"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import { useTranslations, useLocale } from "next-intl"
import TextareaAutosize from "react-textarea-autosize"

import Image from "next/image"

import CommonAvatar from "@/components/common/common-avatar"
import { TPost } from "@/components/post/types"
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
import { EN_MMM_D_h_mm_A, LOCAL_ZH, ZH_M_D_HH_mm } from "@/lib/constant"
import { useGlobal } from "@/lib/contexts/global-context"

import CommentSkeleton from "./comment-skeleton"
import EmojiPicker from "./emoji-picker"
import { useCommonMessageContext } from "../common/common-message"
import SheetSelect from "../common/sheet-select"

interface CommentsProps {
  post_id: number
  post: TPost
  comments: CommentInfo[]
  removeComment: (id: number) => void
  fetchComments: () => void
  increaseCommentCount: (n: number) => void
}

export default function Comments(props: CommentsProps) {
  const { post_id, post, comments, removeComment, fetchComments, increaseCommentCount } = props
  const { sid } = useGlobal()
  const { showMessage } = useCommonMessageContext()
  const t = useTranslations("Common.post")
  const [input, setInput] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  {/* 帖子不可见且非自己不可评论 */ }
  if (post.visibility !== 0 && sid != post.id) return null
  return (
    <>
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <div className="flex grow items-center gap-2 rounded-[18px] bg-gray-50 p-2">
            <TextareaAutosize
              minRows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="grow bg-transparent"
              placeholder={t("commentPlaceholder")}
            />
            <Image
              src="/theme/icon_fans_comment_face@3x.png"
              width={24}
              height={24}
              alt=""
              className="size-[24px]"
              onClick={() => setShowEmojiPicker((pre) => !pre)}
            />
          </div>
          <div
            className={`p-1 ${!input || input === "" ? "bg-sky-500/50" : "bg-theme"
              } bg-sky size-[30px] rounded-[50%]`}
          >
            <Image
              // src="/theme/icon_fans_comment_send@3x.png"
              src="/svgIcons/icon_fans_comment_send@3x.svg"
              width={24}
              height={24}
              alt=""
              onClick={async () => {
                if (input) {
                  await sendComment()
                }
              }}
            />
          </div>
        </div>
        {showEmojiPicker && <EmojiPicker onClick={(emoji) => setInput((pre) => pre + emoji)} />}
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} removed={removeComment} />
        ))}
      </div>
    </>
  )

  async function sendComment() {
    const success = await addComment({ post_id, content: input })
    if (success) {
      fetchComments()
      increaseCommentCount(1)
      setInput("")
      showMessage(t("thanksComment"), "love")
      setShowEmojiPicker(false)
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
  const { showMessage } = useCommonMessageContext()
  const t = useTranslations("Common.post")
  const {
    user,
    content,
    thumbs_up_count,
    thumb_up,
    id,
    post_id,
    is_self,
    reply_count,
    comment_time
  } = comment
  const { photo, first_name, last_name } = user
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyInput, setReplyInput] = useState("")
  const [thumbupCount, setThumbupCount] = useState(thumbs_up_count)
  const [isThumbupped, setIsThumbupped] = useState(thumb_up)
  const [loading, setLoading] = useState<boolean>(false)
  const [replies, setReplies] = useState<CommentReplyInfo[] | undefined>(undefined)
  const [showReplies, setShowReplies] = useState(false)
  const [openCofirmDeleteComment, setOpenConfirmDeleteComment] = useState<boolean>(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  dayjs.extend(localizedFormat)
  const datetimeFormat = useLocale() === LOCAL_ZH ? ZH_M_D_HH_mm : EN_MMM_D_h_mm_A
  return (
    <>
      <SheetSelect
        isOpen={openCofirmDeleteComment}
        setIsOpen={setOpenConfirmDeleteComment}
        onInputChange={(v) => v === 0 && removeComment()}
        options={[
          {
            label: "",
            description: `${first_name} ${last_name}: ${content}`,
            value: -1,
            descriptionClassName: "text-[15px]"
          },
          {
            label: t("delete"),
            value: 0
          }
        ]}
      >
        <></>
      </SheetSelect>
      <div className="flex flex-col gap-2">
        {!loading ? (
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className={"shrink-0"}>
                <CommonAvatar photoFileId={photo} size={32} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-theme text-xs">{`${first_name} ${last_name}`}</div>
                <div className="break-all text-sm">{content}</div>
                <div className="text-gray-secondary flex gap-4 text-xs">
                  <div>{dayjs.unix(comment_time).format(datetimeFormat)}</div>
                  {reply_count > 0 && (
                    <div onClick={toggleReplies} className="text-theme">
                      {t("replyCount", { count: reply_count })}
                    </div>
                  )}
                  <div onClick={() => setShowReplyInput(!showReplyInput)}>{t("reply")}</div>
                  {is_self && (
                    <div onClick={() => setOpenConfirmDeleteComment(true)}>{t("delete")}</div>
                  )}
                </div>
              </div>
            </div>
            <Thumbup thumbupCount={thumbupCount} isThumbupped={isThumbupped} thumbup={thumbup} />
          </div>
        ) : (
          <CommentSkeleton />
        )}
        {showReplyInput && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex grow items-center gap-2 rounded-[18px] bg-gray-50 p-2">
                <TextareaAutosize
                  minRows={1}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="grow bg-transparent"
                  placeholder={t("replyPlaceholder")}
                />
                <Image
                  src="/theme/icon_fans_comment_face@3x.png"
                  width={24}
                  height={24}
                  alt=""
                  className="size-[24px]"
                  onClick={() => setShowEmojiPicker((pre) => !pre)}
                />
              </div>
              <div
                className={`p-1 ${!replyInput || replyInput === "" ? "bg-sky-500/50" : "bg-theme"
                  } size-[30px] rounded-[50%]`}
              >
                <Image
                  src="/theme/icon_fans_comment_send@3x.png"
                  width={24}
                  height={24}
                  alt=""
                  onClick={async () => {
                    if (replyInput) {
                      await sendReply()
                    }
                  }}
                />
              </div>
            </div>
            {showEmojiPicker && (
              <EmojiPicker onClick={(emoji) => setReplyInput((pre) => pre + emoji)} />
            )}
          </>
        )}
        {showReplies && !!replies?.length && (
          <div className="flex flex-col gap-2.5 pl-10">
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
    </>
  )

  function removeReply(replyId: number) {
    setReplies(replies?.filter((r) => r.id !== replyId))
  }

  async function fetchReplies() {
    setLoading(true)
    const replies = await fetchCommentReplies(id, post_id)
    if (replies.length) {
      setReplies(replies)
      setShowReplies(true)
    }
    setLoading(false)
  }

  async function toggleReplies() {
    if (showReplies) {
      setShowReplies(false)
    } else {
      if (replies === undefined) {
        await fetchReplies()
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
      showMessage(t("commentDeleted"))
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
      setIsThumbupped((pre) => !pre)
      setThumbupCount((pre) => pre - 1)
      showMessage(t("unliked"))
    } else {
      setIsThumbupped((pre) => !pre)
      setThumbupCount((pre) => pre + 1)
      showMessage(t("liked"), "love")
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
      showMessage(t("thanksComment"), "love")
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
  const { showMessage } = useCommonMessageContext()
  const t = useTranslations("Common.post")
  const {
    user,
    content,
    thumbs_up_count,
    thumb_up,
    id,
    comment_id,
    is_self,
    reply_user,
    comment_time
  } = reply
  const { photo, first_name, last_name } = user
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyInput, setReplyInput] = useState("")
  const [thumbupCount, setThumbupCount] = useState(thumbs_up_count)
  const [isThumbupped, setIsThumbupped] = useState(thumb_up)
  const [openCofirmDeleteReply, setOpenConfirmDeleteReply] = useState<boolean>(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  dayjs.extend(localizedFormat)
  const datetimeFormat = useLocale() === LOCAL_ZH ? ZH_M_D_HH_mm : EN_MMM_D_h_mm_A
  return (
    <>
      <SheetSelect
        isOpen={openCofirmDeleteReply}
        setIsOpen={setOpenConfirmDeleteReply}
        onInputChange={(v) => v === 0 && removeReply()}
        options={[
          {
            label: "",
            description: `${first_name} ${last_name}: ${content}`,
            descriptionClassName: "text-[15px]",
            value: -1
          },
          {
            label: t("delete"),
            value: 0
          }
        ]}
      >
        <></>
      </SheetSelect>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className={"shrink-0"}>
              <CommonAvatar photoFileId={photo} size={32} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-theme text-xs">
                {first_name} {last_name}
              </div>
              <div className="text-sm">
                {reply_user && (
                  <span className="text-gray-secondary">
                    {t("reply")} {`${reply_user.first_name} ${reply_user.last_name}`} :{" "}
                  </span>
                )}
                <span>{content}</span>
              </div>
              <div className="text-gray-secondary flex gap-4 text-xs">
                {" "}
                <div>{dayjs.unix(comment_time).format(datetimeFormat)}</div>
                <div onClick={() => setShowReplyInput(!showReplyInput)}>{t("reply")}</div>
                {is_self && (
                  <div onClick={() => setOpenConfirmDeleteReply(true)}>{t("delete")}</div>
                )}
              </div>
            </div>
          </div>
          <Thumbup thumbupCount={thumbupCount} isThumbupped={isThumbupped} thumbup={thumbup} />
        </div>
        {showReplyInput && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex grow items-center gap-2 rounded-[18px] bg-gray-50 p-2">
                <TextareaAutosize
                  minRows={1}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="grow bg-transparent"
                  placeholder={t("replyPlaceholder")}
                />
                <Image
                  src="/theme/icon_fans_comment_face@3x.png"
                  width={24}
                  height={24}
                  alt=""
                  className="size-[24px]"
                  onClick={() => setShowEmojiPicker((pre) => !pre)}
                />
              </div>
              <div
                className={`p-1 ${!replyInput || replyInput === "" ? "bg-sky-500/50" : "bg-theme"
                  } size-[30px] rounded-[50%]`}
              >
                <Image
                  src="/theme/icon_fans_comment_send@3x.png"
                  width={24}
                  height={24}
                  alt=""
                  onClick={async () => {
                    if (replyInput) {
                      await sendReply()
                    }
                  }}
                />
              </div>
            </div>
            {showEmojiPicker && (
              <EmojiPicker onClick={(emoji) => setReplyInput((pre) => pre + emoji)} />
            )}
          </>
        )}
      </div>
    </>
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
      showMessage(t("thanksComment"), "love")
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
      showMessage(t("commentsDeleted"))
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
      setIsThumbupped((pre) => !pre)
      setThumbupCount((pre) => pre - 1)
      showMessage(t("unliked"))
    } else {
      setIsThumbupped((pre) => !pre)
      setThumbupCount((pre) => pre + 1)
      showMessage(t("liked"), "love")
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
    <div className="ml-2 flex flex-col items-center" onClick={thumbup}>
      <Image
        src={`${isThumbupped ? "/theme/icon_info_good_red@3x.png" : "/icons/thumbup.png"}`}
        width={20}
        height={20}
        alt=""
        className="max-w-4"
      />
      <div className={`text-[10px] ${isThumbupped ? "text-theme" : "text-gray-secondary"}`}>
        {thumbupCount}
      </div>
    </div>
  )
}
