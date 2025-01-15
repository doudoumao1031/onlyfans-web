import Image from "next/image"
import Avatar from "./avatar"
import { CommentInfo, CommentReplyInfo } from "@/lib"

export default function Comments({ comments }: { comments: CommentInfo[] }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {comments.map((c, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Comment comment={c} />
          {c.reply_arr?.length && (
            <div className="pl-11 flex flex-col gap-2">
              {c.reply_arr.map((r, j) => (
                <Comment comment={r} key={j} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Comment({ comment }: { comment: CommentInfo | CommentReplyInfo }) {
  const { user, content, thumbs_up_count } = comment
  const { photo, username } = user

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Avatar fileId={photo} width={10} />
        <div className="flex flex-col gap-1">
          <div className="text-xs text-[#FF8492]">{username}</div>
          <div className="text-sm">{content}</div>
          <div className="flex gap-4 text-xs text-[#6D7781]">
            <div>回复</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center ml-2">
        <Image src="/icons/thumbup.png" width={20} height={20} alt="" className="max-w-4" />
        <div className="text-[10px] text-[#6D7781]">{thumbs_up_count}</div>
      </div>
    </div>
  )
}
