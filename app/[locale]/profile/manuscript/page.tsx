"use client"

import TabTitle, { iTabTitleOption } from "@/components/profile/tab-title"
import React, { Fragment, SyntheticEvent, useEffect, useState } from "react"
import IconWithImage from "@/components/profile/icon"
import ManuscriptItem from "@/components/profile/manuscript/manuscript-item"
import Header from "@/components/common/header"
import { Link } from "@/i18n/routing"
import { Attachment, FileType, myMediaPosts, myPosts, PageResponse, PostData, SearchPostReq } from "@/lib"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { LazyImageWithFileId } from "@/components/common/lazy-img"
import { useTranslations } from "next-intl"
import { MediaPreview, PreviewType } from "@/components/profile/manuscript/media-preview"
import { ImageCarouselPreview } from "@/components/profile/manuscript/image-carousel-preview"

enum ACTIVE_TYPE {
  POST = "POST",
  MEDIA = "MEDIA"
}

const ManuscriptPost = () => {
  const [timeSort, setTimeSort] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [initData, setInitData] = useState<PageResponse<PostData>>()
  const t = useTranslations("Profile.manuscript")
  const commonTrans = useTranslations("Common")
  const fetchInitData = () => {
    myPosts({
      title,
      page: 1,
      pageSize: 10,
      from_id: 0,
      sort_type: 0,
      sort_asc: timeSort,
      post_status: 1
    }).then(response => {
      if (response) {
        setInitData(response)
      }
    })
  }
  useEffect(fetchInitData, [])

  const infiniteFetchMyPosts = useInfiniteFetch<SearchPostReq, PostData>({
    fetchFn: myPosts,
    params: {
      title,
      pageSize: 10,
      from_id: 0
    }
  })

  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()
    fetchInitData()
  }

  return (
    <section className="pl-4 pr-4 text-black">
      <form onSubmit={handleFormSubmit}>
        <section className="mt-5 flex gap-4 items-center">
          <div className={"flex-1 pt-2 pb-2 pl-3 pr-3 bg-[#F4F5F5] rounded-full flex items-center"}>
            <IconWithImage url={"/icons/profile/icon_search_s@3x.png"} width={18} height={18}
              color={"rgb(221, 221, 221)"}
            />
            <input value={title} onChange={(event) => {
              setTitle(event.target.value)
            }} placeholder={t("searchPlaceHolder")} className="w-full bg-transparent flex pl-0.5"
            />
          </div>

          <button className="shrink-0" onTouchEnd={() => {
            setTimeSort(prevState => !prevState)
          }}
          >
            <div className="flex items-center justify-center">
              <IconWithImage
                url={`/icons/profile/${timeSort ? "icon_gradedown" : "icon_gradeup"}@3x.png`} color={"#000"}
                width={20} height={20}
              />
            </div>
            <span className="text-text-theme text-xs">{commonTrans("createTime")}</span>
          </button>
        </section>
      </form>
      <section className={"flex flex-col gap-2.5 h-[calc(100vh-145px)]"}>
        {initData && (
          <InfiniteScroll<PostData> fetcherFn={infiniteFetchMyPosts} initialItems={initData.list} initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}>
            {({ items, isLoading, hasMore, error }) => (
              <Fragment>
                {Boolean(error) && <ListError />}
                {items?.map((item, index) => <ManuscriptItem data={item} key={index} refresh={fetchInitData} />)}
                {isLoading && <ListLoading />}
                {!hasMore && items?.length > 0 && <ListEnd />}
              </Fragment>
            )}
          </InfiniteScroll>
        )}
      </section>
    </section>
  )
}

function MediaImagePreview({ attachment }: { attachment: Attachment[] }) {
  if (attachment.length === 0) {
    return null
  }
  const [firstMedia] = attachment
  const fileId = firstMedia?.file_type === FileType.Image ? firstMedia.file_id : firstMedia.thumb_id
  return <LazyImageWithFileId containerAuto={true} fileId={fileId} alt={"post_attachment"} width={200} height={220} className="max-w-full max-h-full object-contain" />
}

const ManuscriptMedia = () => {
  const [timeSort, setTimeSort] = useState<boolean>(false)
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const [openState, setOpenState] = useState<boolean>(false)
  const [imagesPreviewOpenState, setImagePreviewOpenState] = useState<boolean>(false)
  const [imageList, setImageList] = useState<string[]>([])
  const [previewFileId, setPreviewFileId] = useState<string>("")
  const commonTrans = useTranslations("Common")
  const t = useTranslations("Profile.manuscript")
  useEffect(() => {
    myMediaPosts({
      page: 1,
      pageSize: 10,
      from_id: 0
    }).then(response => {
      setInitData(response)
    })
  }, [])

  const infiniteFetchMedia = useInfiniteFetch({
    fetchFn: myMediaPosts,
    params: {
      pageSize: 10,
      from_id: 0
    }
  })

  const openMediaPreview = (data:PostData) => {
    const { post_attachment,post } = data
    if (post_attachment.length === 0) {
      return
    }
    const [media] = post_attachment
    if (media.file_type === FileType.Image) {
      setImageList(post_attachment.map(item => item.file_id))
      setImagePreviewOpenState(true)
      return
    }
    // 2审核中
    if (post.post_status === 2) {
      return
    }
    setPreviewFileId(media.file_id)
    setOpenState(true)
  }
  return (
    <>
      <ImageCarouselPreview
        openState={imagesPreviewOpenState}
        setOpenState={setImagePreviewOpenState}
        imagesList={imageList}
      />
      <MediaPreview
        fileId={previewFileId}
        previewType={PreviewType.ONLINE}
        mediaType={FileType.Video}
        openState={openState}
        setOpenState={setOpenState}
      />
      <section className="pl-4 pr-4 text-black">
        <div className={"flex-1 flex justify-end mt-5"}>
          <button className="shrink-0" onTouchEnd={() => {
            setTimeSort(prevState => !prevState)
          }}
          >
            <div className="flex items-center justify-center">
              <IconWithImage
                url={`/icons/profile/${timeSort ? "icon_gradedown" : "icon_gradeup"}@3x.png`} color={"#000"}
                width={20} height={20}
              />
            </div>
            <span className="text-text-theme text-xs">{commonTrans("createTime")}</span>
          </button>
        </div>
        <section className="h-[calc(100vh-195px)]">
          {initData && (
            <InfiniteScroll<PostData> className={"mt-2"} fetcherFn={infiniteFetchMedia} initialItems={initData.list} initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}>
              {({ items, isLoading, hasMore, error }) => (
                <Fragment>
                  {Boolean(error) && <ListError />}
                  <div className={"grid grid-cols-2 gap-3 "}>
                    {items?.map((item, index) => (
                      <section key={index}>
                        <section className="rounded-xl relative overflow-hidden text-xs bg-black/20">
                          <section className="pl-2 pr-2 text-white absolute w-full left-0 flex justify-between top-0.5 z-10">
                            <section className="flex items-center gap-0.5">
                              <IconWithImage url={"/icons/profile/icon_fans_view_s@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              <span>{item.post_metric.play_count}</span>
                            </section>
                            <section className="flex items-center gap-0.5">
                              <IconWithImage url={"/icons/profile/icon_fans_money_s@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              <span>{item.post_metric.tip_count}</span>
                            </section>
                          </section>
                          <section className="pl-2 pr-2 text-white absolute w-full left-0 flex bottom-0.5 justify-around z-10">
                            <section className="flex items-center gap-0.5 flex-1">
                              <IconWithImage url={"/icons/profile/icon_fans_like@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              <span>{item.post_metric.thumbs_up_count}</span>
                            </section>
                            <section className="flex items-center gap-0.5 flex-1 justify-center">
                              <IconWithImage url={"/icons/profile/icon_fans_comment@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              <span>{item.post_metric.comment_count}</span>
                            </section>
                            <section className="flex items-center gap-0.5 flex-1 justify-end">
                              <IconWithImage url={"/icons/profile/icon_fans_reward@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              <span>{item.post_metric.share_count}</span>
                            </section>
                          </section>
                          <section
                            onTouchEnd={() => {
                              openMediaPreview(item)
                            }}
                            className="w-full h-[220px] rounded flex justify-center items-center overflow-hidden"
                          >
                            <MediaImagePreview attachment={item.post_attachment ?? []} />
                            {/* <LazyImageWithFileId containerAuto={true} fileId={item.post_attachment?.[0]?.file_id} alt={"post_attachment"} width={200} height={220} className="max-w-full max-h-full object-contain" /> */}
                          </section>
                        </section>
                        {/*// 0草稿状态 1发布 2审核中 3未通过*/}
                        {
                          [0, 1, 3].includes(item.post.post_status) ? (
                            <Link href={`/profile/manuscript/draft/edit?id=${item.post.id}`}
                              className="rounded-[10px] gap-2 flex justify-center pt-2 pb-2 border-border-theme border-2 text-text-theme w-full mt-2"
                            >
                              <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20}
                                className={"bg-background-theme"}
                              />
                              <span>{t("itemActions.edit")}</span>
                            </Link>
                            )
                            : (
                              <button type={"button"}
                                className="rounded-[10px] grayscale gap-2 flex justify-center pt-2 pb-2 border-border-theme border-2 text-text-theme w-full mt-2"
                              >
                                <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} className={"bg-background-theme"} />
                                <span>{t("itemActions.edit")}</span>
                              </button>
                            )
                        }
                      </section>
                    ))}
                  </div>
                  {isLoading && <ListLoading />}
                  {!hasMore && items?.length > 0 && <ListEnd />}
                </Fragment>
              )}
            </InfiniteScroll>
          )}
        </section>
      </section>
    </>
  )
}

export default function Page() {
  const t = useTranslations("Profile.manuscript")
  const [active, setActive] = useState<string>(ACTIVE_TYPE.POST)
  const tabOptions: iTabTitleOption[] = [
    { label: t("post"), name: ACTIVE_TYPE.POST },
    { label: t("media"), name: ACTIVE_TYPE.MEDIA }
  ]

  return (
    <div>
      <Header title={t("title")} titleColor={"#000"} right={<Link href={"/profile/manuscript/draft"} className="text-text-theme text-base">{t("draft")}</Link>}>
      </Header>
      <TabTitle tabOptions={tabOptions} active={active} activeChange={setActive} />
      {active === ACTIVE_TYPE.POST && <ManuscriptPost />}
      {active === ACTIVE_TYPE.MEDIA && <ManuscriptMedia />}
    </div>
  )
}