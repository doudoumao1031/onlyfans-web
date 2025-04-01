import { useState } from "react"

import { useTranslations } from "next-intl"

import LazyImg from "@/components/common/lazy-img"
import Modal from "@/components/space/modal"
import { Link } from "@/i18n/routing"
import { User } from "@/lib"
import { useGlobal } from "@/lib/contexts/global-context"
import { buildImageUrl } from "@/lib/utils"

import ImgPreview from "./Img-preview"
import { Attachment, FileType, TPost } from "./types"
import { VideoPreview } from "./video-preview"
import IconWithImage from "../profile/icon"


interface MediaProps {
  data: Attachment[]
  post: TPost
  user: User
  isInfoPage?: boolean
  followConfirm?: () => void
}
export default function Media(props: MediaProps) {
  const { sid } = useGlobal()
  const t = useTranslations("PostInfo")
  const tSpace = useTranslations("Space")
  const { data, post, user, isInfoPage, followConfirm } = props
  const showIds = data.map((v) => v.file_id).join("_")
  const [followModal, setFollowModal] = useState<boolean>(false)
  const hasThumbId = !!data[0].thumb_id
  const content = (
    <div>
      <div className={`absolute left-0 top-0 z-20 flex size-full flex-col items-center justify-center rounded-lg ${hasThumbId && "bg-black bg-opacity-[30%] backdrop-blur-md"}`}>
        <IconWithImage url="/icons/icon_info_lock_white.png" width={32} color="#fff" height={32} />
        <span className="mt-2 text-white">
          {post.visibility === 2 ? tSpace("tip1") : tSpace("tip2")}
        </span>
      </div>
      <LazyImg
        className={"block aspect-square "}
        src={hasThumbId ? buildImageUrl(data[0]?.thumb_id) : "/icons/default/img_media_default_lj.png"}
        alt=""
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover"
        }}
        width={343}
        height={200}
      />
    </div>
  )
  return (
    <>
      {/*订阅查看并且未订阅 或者 付费观看*/}
      {((post.visibility === 1 && !user.sub) || post.visibility === 2) && (
        <div className="relative h-[200px] w-full">
          {/*帖子详情正常查看 ｜ 推荐/空间点击媒体到帖子详情*/}
          {isInfoPage ? content : <Link href={`/postInfo/${post.id}`}>{content}</Link>}
        </div>
      )}
      {(post.visibility === 0 || (post.visibility === 1 && user.sub)) && (
        <div
          className={
            data.length > 1 ? "relative grid  grid-cols-3 gap-1 " : "relative size-full"
          }
        >
          {
            /*非自己 && 详情页面 && 订阅需要付费 && 帖子无需付费 => 打开确认关注modal */
            user.id != sid && isInfoPage && user.sub_price > 0 && !user.following && !user.sub ? (
              <>
                {data.map(({ file_id, file_type, thumb_id }, i) => {
                  return (
                    <button
                      key={i}
                      type={"button"}
                      onClick={() => {
                        setFollowModal(true)
                      }}
                      className={
                        file_type === FileType.Video ? "col-span-3 w-full" : "block size-full "
                      }
                    >
                      {file_type === FileType.Video ? (
                        <VideoPreview fileId={file_id} thumbId={thumb_id} />
                      ) : (
                        <ImgPreview data={data} file_id={file_id}/>
                      )}
                    </button>
                  )
                })}
              </>
            ) : (
              <>
                {data.map(({ file_id, file_type, thumb_id }, i) => {
                  /*订阅需要付费 && 帖子无需付费 => 只需要关注则可查看 */
                  const toDetail = (user.id !== sid) && !isInfoPage &&
                    ((user.sub_price > 0 && !user.following) || (user.sub_price === 0 && !user.sub))
                  return (
                    <Link
                      key={i}
                      href={
                        toDetail
                          ? `/postInfo/${post.id}`
                          : `/media/${file_type === FileType.Video ? "video" : "image"}/${file_type === FileType.Video ? showIds + "_" + post.id : showIds + "_" + i
                          }`
                      }
                      className={
                        file_type === FileType.Video
                          ? "col-span-3 size-full"
                          : "relative block size-full"
                      }
                    >
                      {file_type === FileType.Video ? (
                        <VideoPreview fileId={file_id} thumbId={thumb_id} />
                      ) : (
                        <ImgPreview data={data} file_id={file_id}/>
                      )}
                    </Link>
                  )
                })}
              </>
            )
          }
        </div>
      )}

      <Modal
        visible={followModal}
        cancel={() => {
          setFollowModal(false)
        }}
        type={"modal"}
        content={<div className="p-4 pb-6">{t("followedView")}</div>}
        okText={t("freeFollow")}
        confirm={() => {
          setFollowModal(false)
          followConfirm?.()
        }}
      />
    </>
  )
}
