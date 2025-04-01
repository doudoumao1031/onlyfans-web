import { postSharLog } from "@/lib"

import Stats from "./stats"
import { Attachment, FileType } from "./types"

export type ShareParams = {
  postId: string,
  title: string,
  firstName: string,
  lastName: string,
  username: string,
  fansId: string,
  data: Attachment[]
}


export default function Share({ count, postId, shareParams }: { count: number; postId: number, shareParams: ShareParams }) {
  const handleShare = () => {
    try {
      const { postId, title, firstName, lastName, username, fansId, data } = shareParams
      let isVideo = false
      let fileId = ""
      let coverId = ""
      if (data.length > 0) {
        data?.some((item) => {
          if (item.file_type === FileType.Video) {
            isVideo = true
            fileId = item.file_id
            coverId = item.thumb_id ? item.thumb_id : ""
          }
        })
      }
      const postData = {
        type: "post",
        postId,
        title,
        firstName,
        lastName,
        username,
        fansId,
        isVideo: isVideo,
        fileId,
        coverId
      }
      console.log(postData, "postData")

      window.callAppApi("ShareText", JSON.stringify(postData))
    } catch (error) {
      console.log("分享失败", error)
    }
  }
  return (
    <button
      onTouchEnd={() => {
        postSharLog({ post_id: postId })
        handleShare()
      }}
    >
      <Stats icon="icon_fans_share" value={count} />
    </button>
  )
}
