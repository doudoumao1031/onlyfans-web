// 稿件
import Image from "next/image"
import IconWithImage from "@/components/profile/icon"
import { Link } from "@/i18n/routing"
import { clsx } from "clsx"
import { FileType, PostData, postPined } from "@/lib"
import { useCommonMessageContext } from "@/components/common/common-message"
import LazyImg from "@/components/common/lazy-img"
import { buildImageUrl, TIME_FORMAT } from "@/lib/utils"
import { useTranslations } from "next-intl"
import dayjs from "dayjs"

const ShowNumberWithIcon = ({ icon, number }: { icon: string, number: number }) => {
  return (
    <section className="flex justify-center flex-col items-center flex-1">
      <IconWithImage url={icon} height={12} width={12} color={"#222"}/>
      <div className="text-[#222]">{number}</div>
    </section>
  )
}

const ManuscriptActions = ({ id, postStatus, refresh, pinned }: { id: number, postStatus: number, refresh?: () => void ,pinned: boolean}) => {
  const t = useTranslations("Profile.manuscript")
  const { showMessage } = useCommonMessageContext()
  const isAuditing = postStatus === 2
  const handlePined = () => {
    postPined(id).then((data) => {
      if (data?.code === 0) {
        showMessage(pinned ? t("unpinned") : t("pinned"), "", {
          duration: 1500,
          afterDuration: () => {
            refresh?.()
          }
        })
      }
    })
  }
  // 审核中不允许有操作
  if (isAuditing) {
    return (
      <section className="flex opacity-50">
        <button className="flex-1 flex gap-2 pt-2.5 pb-2.5">
          <IconWithImage url={"/theme/icon_fans_share_normal@3x.png"} width={20} height={20} color={"#222"}/>
          <span>{t("itemActions.share")}</span>
        </button>
        <button className="flex-1 flex gap-2 pt-2.5 pb-2.5">
          <IconWithImage url={"/theme/icon_fans_stick_dark@3x.png"} width={20} height={20} color={"#222"}/>
          <span>{pinned ? t("itemActions.pinned") : t("itemActions.unpinned")}</span>
        </button>
        <button className="flex-1 flex gap-2 pt-2.5 pb-2.5">
          <IconWithImage url={"/icons/profile/icon_fans_data_gray@3x.png"} width={20} height={20} color={"#222"}/>
          <span>{t("itemActions.data")}</span>
        </button>
        <button type={"button"} className="flex-1 flex gap-2 pt-2.5 pb-2.5 ">
          <IconWithImage url={"/theme/icon_fans_edit_red@3x.png"} width={20} height={20} color={"#222"}/>
          <span>{t("itemActions.edit")}</span>
        </button>
      </section>
    )
  }
  return (
    <section className="flex">
      <button className="flex-1 flex gap-2 pt-2.5 pb-2.5">
        <IconWithImage url={"/theme/icon_fans_share_normal@3x.png"} width={20} height={20} color={"#222"}/>
        <span>{t("itemActions.share")}</span>
      </button>
      <button onTouchEnd={handlePined} className="flex-1 flex gap-2 pt-2.5 pb-2.5">
        <IconWithImage url={pinned ? "/theme/icon_fans_stick_highlight@3x.png" :"/theme/icon_fans_stick_dark@3x.png"} width={20} height={20} className={clsx(
          pinned ? "bg-background-theme" : "bg-black"
        )}
        />
        <span className={clsx(
          pinned ? "text-text-theme":""
        )}
        >{pinned ? t("itemActions.pinned") : t("itemActions.unpinned")}</span>
      </button>
      <Link href={`/profile/dataCenter/feeds?id=${id}`} className="flex-1 flex gap-2 pt-2.5 pb-2.5">
        <IconWithImage url={"/icons/profile/icon_fans_data_gray@3x.png"} width={20} height={20} color={"#222"}/>
        <span>{t("itemActions.data")}</span>
      </Link>
      {[0, 3].includes(postStatus) ? (
        <Link href={`/profile/manuscript/draft/edit?id=${id}`}
          className="flex-1 flex gap-2 pt-2.5 pb-2.5 text-text-theme"
        >
          <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} className={"bg-background-theme"}/>
          <span>{t("itemActions.edit")}</span>
        </Link>
      ) : (
        <button type={"button"} className="flex-1 flex gap-2 pt-2.5 pb-2.5 opacity-50">
          <IconWithImage url={"/theme/icon_fans_edit_red@3x.png"} width={20} height={20} color={"#222"}/>
          <span>{t("itemActions.edit")}</span>
        </button>
      )}
    </section>
  )
}

const ManuscriptItemState = ({ state }: { state: number }) => {
  const t = useTranslations("Profile.manuscript")
  if (![2, 3].includes(state)) return null
  const textMap = {
    "2": t("itemState.auditing"),
    "3": t("itemState.rejected")
  }
  return (
    <span className={clsx(
      "leading-[15px] text-xs rounded-br rounded-tl px-1.5 text-white absolute left-0 top-0 z-10",
      state === 2 ? "bg-[#58bf8e]" : "bg-background-theme",
    )}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    >{textMap[state]}</span>
  )
}
export default function ManuscriptItem({ data, refresh }: { data: PostData, refresh?: () => void }) {
  const firstMedia = data.post_attachment?.[0]
  let imageId = ""
  if (firstMedia?.file_type === FileType.Image) {
    imageId = firstMedia.file_id
  }
  if (firstMedia?.file_type === FileType.Video) {
    imageId = firstMedia.thumb_id
  }
  return (
    <section className="border-b border-gray-100 pt-4">
      <button className={"flex gap-2.5 text-left h-[100px] relative w-full"}>
        {/*<ManuscriptItemState state={"REJECT"}/>*/}
        <ManuscriptItemState state={data.post.post_status}/>
        <div className={"w-[100px] h-[100px] overflow-hidden rounded"}>
          {imageId ? <LazyImg src={buildImageUrl(imageId)} alt={"post"} width={100} height={100}/>
            : (
              <Image src={"/icons/image_draft.png"} alt={""} width={100} height={100}
                className={"shrink-0 w-[100px] h-full rounded"}
              />
            )
          }
        </div>
        <section className={"flex-1 h-full flex flex-col justify-between "}>
          <h3 className="line-clamp-[2]">{data.post.title}</h3>
          <section className={"flex-1 flex items-center text-[#bbb]"}>{data.post.pub_time ? dayjs(data.post.pub_time * 1000).format(TIME_FORMAT) : ""}</section>
          <section className="flex gap-4 text-xs justify-around">
            <ShowNumberWithIcon number={data.post_metric?.thumbs_up_count ?? 0}
              icon={"/icons/profile/icon_fans_like_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.comment_count ?? 0}
              icon={"/icons/profile/icon_fans_comment_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.play_count ?? 0}
              icon={"/icons/profile/icon_fans_reward_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.share_count ?? 0}
              icon={"/icons/profile/icon_fans_share_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.collection_count ?? 0}
              icon={"/icons/profile/icon_fans_collect_normal@3x.png"}
            />
            <ShowNumberWithIcon number={data.post_metric?.tip_count ?? 0}
              icon={"/icons/profile/icon_fans_money_s_gray@3x.png"}
            />
          </section>
        </section>
      </button>
      <ManuscriptActions id={data.post.id} postStatus={data.post.post_status} refresh={refresh} pinned={data.post.pinned}/>
    </section>
  )
}