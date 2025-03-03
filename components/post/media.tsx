import { Link } from "@/i18n/routing"
import { Attachment, FileType, TPost } from "./types"
import { buildImageUrl } from "@/lib/utils"
import { VideoPreview } from "./video-preview"
import LazyImg from "@/components/common/lazy-img"
import IconWithImage from "../profile/icon"
import { User } from "@/lib"
import Modal from "@/components/space/modal"
import { useState } from "react"
import { useTranslations } from "next-intl"

interface MediaProps {
  data: Attachment[]
  post: TPost
  user: User
  isInfoPage?: boolean
  followConfirm?: () => void
}
export default function Media(props: MediaProps) {
  const t = useTranslations("PostInfo")
  const tSpace = useTranslations("Space")
  const { data, post, user, isInfoPage, followConfirm } = props
  const showIds = data.map((v) => v.file_id).join("_")
  const [followModal, setFollowModal] = useState<boolean>(false)
  const content = (
    <div className="w-full h-full bg-black bg-opacity-[30%] rounded-lg backdrop-blur absolute top-0 left-0 z-20 flex flex-col items-center justify-center">
      <IconWithImage url="/icons/icon_info_lock_white.png" width={32} color="#fff" height={32} />
      <span className="mt-2 text-white">
        {post.visibility === 2 ? tSpace("tip1") : tSpace("tip2")}
      </span>
    </div>
  )
  return (
    <>
      {/*订阅查看并且未订阅 或者 付费观看*/}
      {((post.visibility === 1 && !user.sub) || post.visibility === 2) && (
        <div className="w-full h-[200px] relative">
          {/*帖子详情正常查看 ｜ 推荐/空间点击媒体到帖子详情*/}
          {isInfoPage ? content : <Link href={`/postInfo/${post.id}`}>{content}</Link>}
          <LazyImg
            className={"aspect-square rounded-md block"}
            src={"/icons/default/img_media_default.png"}
            alt=""
            style={{
              width: "100%",
              height: "200px"
            }}
            width={343}
            height={200}
          />
        </div>
      )}
      {(post.visibility === 0 || (post.visibility === 1 && user.sub)) && (
        <div className="grid grid-cols-3 gap-2 relative">
          {
            /*详情页面 && 订阅需要付费 && 帖子无需付费 => 打开确认关注modal */
            isInfoPage && user.sub_price > 0 && !user.following && !user.sub ? (
              <>
                {data.map(({ file_id, file_type, thumb_id }, i) => {
                  return (
                    <button
                      key={i}
                      type={"button"}
                      onClick={() => {
                        setFollowModal(true)
                      }}
                      className={file_type === FileType.Video ? "col-span-3" : "block"}
                    >
                      {file_type === FileType.Video ? (
                        <VideoPreview fileId={file_id} thumbId={thumb_id} />
                      ) : (
                        <div className="w-full h-full">
                          <LazyImg
                            className="aspect-square rounded-md "
                            src={buildImageUrl(file_id)}
                            style={{ objectFit: "cover" }}
                            alt=""
                            width={200}
                            height={200}
                          />
                        </div>
                      )}
                    </button>
                  )
                })}
              </>
            ) : (
              <>
                {data.map(({ file_id, file_type, thumb_id }, i) => {
                  /*订阅需要付费 && 帖子无需付费 => 只需要关注则可查看 */
                  const toDetail =
                    !isInfoPage &&
                    ((user.sub_price > 0 && !user.following) || (user.sub_price === 0 && !user.sub))
                  return (
                    <Link
                      key={i}
                      href={
                        toDetail
                          ? `/postInfo/${post.id}`
                          : `/media/${file_type === FileType.Video ? "video" : "image"}/${
                              file_type === FileType.Video ? showIds : showIds + "_" + i
                            }`
                      }
                      className={file_type === FileType.Video ? "col-span-3" : "block"}
                    >
                      {file_type === FileType.Video ? (
                        <VideoPreview fileId={file_id} thumbId={thumb_id} />
                      ) : (
                        <LazyImg
                          className="aspect-square rounded-md "
                          src={buildImageUrl(file_id)}
                          style={{ objectFit: "cover" }}
                          alt=""
                          width={200}
                          height={200}
                        />
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
