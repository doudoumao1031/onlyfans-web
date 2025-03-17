// 稿件
import Image from "next/image"
import IconWithImage from "@/components/profile/icon"
import { Link } from "@/i18n/routing"
import { clsx } from "clsx"
import { deletePost, FileType, PostData, postPined } from "@/lib"
import { useCommonMessageContext } from "@/components/common/common-message"
import LazyImg from "@/components/common/lazy-img"
import { buildImageUrl, TIME_FORMAT } from "@/lib/utils"
import { useTranslations } from "next-intl"
import dayjs from "dayjs"
import { useMemo, useRef, useState } from "react"
import { useLongPress, LongPressEventType } from "use-long-press"
import SheetSelect from "@/components/common/sheet-select"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
// import { LongPressEventType } from "use-long-press/lib/use-long-press.types"

const ShowNumberWithIcon = ({ icon, number }: { icon: string, number: number }) => {
  return (
    <section className="flex justify-center flex-col items-center flex-1">
      <IconWithImage url={icon} height={12} width={12} color={"#222"} />
      <div className="text-[#222]">{number}</div>
    </section>
  )
}

const ManuscriptActions = ({ id, postStatus, refresh, pinned }: {
  id: number,
  postStatus: number,
  refresh?: () => void,
  pinned: boolean
}) => {
  const t = useTranslations("Profile.manuscript")
  const { showMessage } = useCommonMessageContext()
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
  // 0草稿状态 1发布 2审核中 3未通过
  const canEdit = useMemo(() => {
    return [0, 1, 3].includes(postStatus)
  }, [postStatus])

  const canShareAndPin = useMemo(() => {
    return [1].includes(postStatus)
  },[postStatus])

  return (
    <section className="flex text-xs">
      <button className={clsx(
        "flex-1 flex gap-2 pt-2.5 pb-2.5 items-center",
        canShareAndPin ? "" : "opacity-50"
      )}
      >
        <IconWithImage url={"/theme/icon_fans_share_normal@3x.png"} width={20} height={20} color={"#222"} />
        <span>{t("itemActions.share")}</span>
      </button>
      <button onTouchEnd={(event) => {
        if (canShareAndPin) {
          handlePined()
        }
        event.preventDefault()
      }} className={clsx(
        "flex-1 flex gap-2 pt-2.5 pb-2.5 items-center",
        canShareAndPin ? "" : "opacity-50"
      )}
      >
        <IconWithImage url={pinned ? "/theme/icon_fans_stick_highlight@3x.png" : "/theme/icon_fans_stick_dark@3x.png"}
          width={20} height={20} className={clsx(
            pinned ? "bg-background-theme" : "bg-black"
          )}
        />
        <span className={clsx(
          pinned ? "text-text-theme" : ""
        )}
        >{pinned ? t("itemActions.pinned") : t("itemActions.unpinned")}</span>
      </button>
      {canShareAndPin ? (
        <Link href={`/profile/dataCenter/feeds?id=${id}`} className="flex-1 flex gap-2 pt-2.5 pb-2.5 items-center">
          <IconWithImage url={"/icons/profile/icon_fans_data_gray@3x.png"} width={20} height={20} color={"#222"} />
          <span>{t("itemActions.data")}</span>
        </Link>
      )
        : (
          <button className="flex-1 flex gap-2 pt-2.5 pb-2.5 opacity-50 items-center">
            <IconWithImage url={"/icons/profile/icon_fans_data_gray@3x.png"} width={20} height={20} color={"#222"} />
            <span>{t("itemActions.data")}</span>
          </button>
        )}
      {canEdit ? (
        <Link href={`/profile/manuscript/draft/edit?id=${id}`}
          className="flex-1 flex gap-2 pt-2.5 pb-2.5 items-center"
        >
          <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20}
            className={"bg-background-theme"}
          />
          <span>{t("itemActions.edit")}</span>
        </Link>
      ) : (
        <button type={"button"} className="flex-1 flex gap-2 pt-2.5 pb-2.5 opacity-50 items-center">
          <IconWithImage url={"/theme/icon_fans_edit_red@3x.png"} width={20} height={20} color={"#222"} />
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
  "use client"
  const commonTrans = useTranslations("Common")
  const [openState, setOpenState] = useState<boolean>(false)
  const firstMedia = data.post_attachment?.[0]
  let imageId = ""
  if (firstMedia?.file_type === FileType.Image) {
    imageId = firstMedia.file_id
  }
  if (firstMedia?.file_type === FileType.Video) {
    imageId = firstMedia.thumb_id
  }
  //
  // const { isPressing } = useLongPress(ref,() => {
  //   setOpenState(true)
  // })

  const { showMessage } = useCommonMessageContext()
  const { withLoading } = useLoadingHandler({
    onError: () => {
      showMessage(commonTrans("updateFail"))
    },
    onSuccess: () => {
      showMessage(commonTrans("updateSuccess"), "success", {
        afterDuration: refresh,
        duration: 500
      })
    }
  })
  const handleSheetChange = async (value: unknown) => {
    if (value === "DEL") {
      await withLoading(async () => {
        try {
          await deletePost(data.post.id)
        } catch {
          return new Error()
        }
      })
    }
  }

  const longPressHandler = useLongPress(() => {
    setOpenState(true)
  }, {
    threshold: 1000,
    detect: LongPressEventType.Touch,
    cancelOnMovement: true,
    cancelOutsideElement: true
  })

  return (
    <>
      <SheetSelect
        options={[
          { label: <span className={"text-[#FF223B]"}>删除</span>, value: "DEL" }
        ]}
        outerControl={true}
        isOpen={openState}
        setIsOpen={setOpenState}
        onInputChange={handleSheetChange}
      />
      <section className="border-b border-gray-100 pt-4">
        <button {...longPressHandler()} className={clsx(
          "flex gap-2.5 text-left h-[100px] relative w-full transition-all rounded-xl"
        )}
        >
          {/*<ManuscriptItemState state={"REJECT"}/>*/}
          <ManuscriptItemState state={data.post.post_status} />
          <div className={"w-[100px] h-[100px] overflow-hidden rounded flex items-center shrink-0"}>
            {imageId ?
              <LazyImg containerAuto={true} src={buildImageUrl(imageId)} alt={"post"} width={100} height={100} />
              : (
                <Image src={"/icons/image_draft.png"} alt={""} width={100} height={100}
                  className={"shrink-0 w-[100px] h-full rounded"}
                />
              )
            }
          </div>
          <Link href={`/profile/manuscript/draft/edit?id=${data.post.id}`} className={"flex-1 h-full flex flex-col justify-between "}>
            <h3 className="line-clamp-[2]">{data.post.title}</h3>
            <section
              className={"flex-1 flex items-center text-[#bbb]"}
            >{data.post.pub_time ? dayjs(data.post.pub_time * 1000).format(TIME_FORMAT) : ""}</section>
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
          </Link>
        </button>
        <ManuscriptActions id={data.post.id} postStatus={data.post.post_status} refresh={refresh}
          pinned={data.post.pinned}
        />
      </section>
    </>
  )
}