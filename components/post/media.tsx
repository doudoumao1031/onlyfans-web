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
import { useGlobal } from "@/lib/contexts/global-context"

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
      <div className={`w-full h-full rounded-lg absolute top-0 left-0 z-20 flex flex-col items-center justify-center ${hasThumbId && "bg-black bg-opacity-[30%] backdrop-blur"}`}>
        <IconWithImage url="/icons/icon_info_lock_white.png" width={32} color="#fff" height={32} />
        <span className="mt-2 text-white">
          {post.visibility === 2 ? tSpace("tip1") : tSpace("tip2")}
        </span>
      </div>
      <LazyImg
        className={"aspect-square rounded-md block"}
        src={hasThumbId ? buildImageUrl(data[0]?.thumb_id) : "/icons/default/img_media_default_lj.png"}
        alt=""
        style={{
          width: "100%",
          height: "200px"
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
        <div className="w-full h-[200px] relative">
          {/*帖子详情正常查看 ｜ 推荐/空间点击媒体到帖子详情*/}
          {isInfoPage ? content : <Link href={`/postInfo/${post.id}`}>{content}</Link>}
        </div>
      )}
      {(post.visibility === 0 || (post.visibility === 1 && user.sub)) && (
        <div
          className={
            data.length > 1 ? "grid grid-cols-3  gap-2 relative " : "relative w-full h-full"
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
                        file_type === FileType.Video ? "col-span-3 w-full" : "block w-full h-full "
                      }
                    >
                      {file_type === FileType.Video ? (
                        <VideoPreview fileId={file_id} thumbId={thumb_id} />
                      ) : (
                        <div className=" flex justify-center relative overflow-hidden">
                          {data.length === 1 && (
                            <div className="w-full h-full absolute top-0 left-0">
                              <LazyImg
                                className="aspect-square rounded-md w-full h-full  z-[-1] object-cover blur-[10px]"
                                src={buildImageUrl(file_id)}
                                alt=""
                                width={200}
                                height={200}
                              />
                            </div>
                          )}
                          <LazyImg
                            className={`aspect-square  relative z-10 ${data.length === 1
                              ? "object-contain max-h-[200px]"
                              : "object-cover rounded-md"
                              }`}
                            src={buildImageUrl(file_id)}
                            alt=""
                            width={200}
                            height={200}
                            layout="responsive"
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
                  const toDetail = (user.id !== sid) && !isInfoPage &&
                    ((user.sub_price > 0 && !user.following) || (user.sub_price === 0 && !user.sub))
                  return (
                    <Link
                      key={i}
                      href={
                        toDetail
                          ? `/postInfo/${post.id}`
                          : `/media/${file_type === FileType.Video ? "video" : "image"}/${file_type === FileType.Video ? showIds : showIds + "_" + i
                          }`
                      }
                      className={
                        file_type === FileType.Video
                          ? "col-span-3 w-full h-full"
                          : "block w-full h-full relative"
                      }
                    >
                      {file_type === FileType.Video ? (
                        <VideoPreview fileId={file_id} thumbId={thumb_id} />
                      ) : (
                        <div className=" flex justify-center relative overflow-hidden">
                          {data.length === 1 && (
                            <div className="w-full h-full absolute top-0 left-0">
                              <LazyImg
                                className="aspect-square rounded-md w-full h-full  z-[-1] object-cover blur-[10px]"
                                src={buildImageUrl(file_id)}
                                alt=""
                                width={200}
                                height={200}
                              />
                            </div>
                          )}
                          <LazyImg
                            className={`aspect-square w-full relative z-10 ${data.length === 1 ? "object-contain " : "object-cover rounded-md"
                              }`}
                            src={buildImageUrl(file_id)}
                            alt=""
                            width={200}
                            height={200}
                            layout="intrinsic"
                          />
                        </div>
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
