"use client"

import React, { Fragment, SyntheticEvent, useEffect, useState } from "react"

import { useTranslations } from "next-intl"

import Header from "@/components/common/header"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { LazyImageWithFileId } from "@/components/common/lazy-img"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import IconWithImage from "@/components/profile/icon"
import { ImageCarouselPreview } from "@/components/profile/manuscript/image-carousel-preview"
import ManuscriptItem from "@/components/profile/manuscript/manuscript-item"
import { MediaPreview, PreviewType } from "@/components/profile/manuscript/media-preview"
import TabTitle, { iTabTitleOption } from "@/components/profile/tab-title"
import { Link } from "@/i18n/routing"
import { Attachment, FileType, myMediaPosts, myPosts, PageResponse, PostData, SearchPostReq } from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"

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
      from_id: 0,
      sort_asc: timeSort,
      post_status: 1
    }
  })

  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()
    fetchInitData()
  }

  return (
    <section className="px-4 text-black">
      <form onSubmit={handleFormSubmit}>
        <section className="mt-5 flex items-center gap-4">
          <div className={"flex flex-1 items-center rounded-full bg-[#F4F5F5] px-3 py-1.5"}>
            <IconWithImage url={"/icons/profile/icon_search_s@3x.png"} width={18} height={18}
              color={"rgb(221, 221, 221)"}
            />
            <input value={title} onChange={(event) => {
              setTitle(event.target.value)
            }} placeholder={t("searchPlaceHolder")} className="flex w-full bg-transparent pl-0.5"
            />
          </div>

          <button type={"button"} className="shrink-0 leading-none" onTouchEnd={() => {
            setTimeSort(prevState => !prevState)
            fetchInitData()
          }}
          >
            <div className="flex items-center justify-center">
              <IconWithImage
                url={`/icons/profile/${!timeSort ? "icon_gradedown" : "icon_gradeup"}@3x.png`} color={"#000"}
                width={20} height={20}
              />
            </div>
            <span className="text-text-theme text-xs">{commonTrans("createTime")}</span>
          </button>
        </section>
      </form>
      <section className={"flex h-[calc(100vh-145px)] flex-col gap-2.5"}>
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
  return <LazyImageWithFileId containerAuto={true} fileId={fileId} alt={"post_attachment"} width={200} height={220} className="max-h-full max-w-full object-contain" />
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

  const initFetchData = () => {
    myMediaPosts({
      page: 1,
      pageSize: 10,
      from_id: 0,
      sort_asc: timeSort
    }).then(response => {
      setInitData(response)
    })
  }

  useEffect(initFetchData, [])

  const infiniteFetchMedia = useInfiniteFetch({
    fetchFn: myMediaPosts,
    params: {
      pageSize: 10,
      from_id: 0,
      sort_asc: timeSort
    }
  })

  const openMediaPreview = (data: PostData) => {
    const { post_attachment, post } = data
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
      <section className="px-4 text-black">
        <div className={"mt-5 flex flex-1 justify-end"}>
          <button type={"button"} className="shrink-0" onTouchEnd={() => {
            setTimeSort(prevState => !prevState)
            initFetchData()
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
                        <section className="relative overflow-hidden rounded-xl bg-black/20 text-xs">
                          <section className="absolute left-0 top-0.5 z-10 flex w-full justify-between px-2 text-white">
                            <section className="flex items-center gap-0.5">
                              <IconWithImage url={"/theme/icon_fans_view_s_white@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              <span>{item.post_metric.play_count}</span>
                            </section>
                            <section className="flex items-center gap-0.5">
                              <IconWithImage url={"/theme/icon_fans_money_s_white@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              {/*付费*/}
                              <span>{item.post_metric.pay_count}</span>
                            </section>
                          </section>
                          <section className="absolute bottom-0.5 left-0 z-10 flex w-full justify-around px-2 text-white">
                            <section className="flex flex-1 items-center gap-0.5">
                              <IconWithImage url={"/theme/icon_fans_like_s_white@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              {/*点赞*/}
                              <span>{item.post_metric.thumbs_up_count}</span>
                            </section>
                            <section className="flex flex-1 items-center justify-center gap-0.5">
                              <IconWithImage url={"/theme/icon_fans_comment_s_white@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              {/*评论*/}
                              <span>{item.post_metric.comment_count}</span>
                            </section>
                            <section className="flex flex-1 items-center justify-end gap-0.5">
                              <IconWithImage url={"/theme/icon_fans_reward_s_white@3x.png"} width={12} height={12}
                                color={"#fff"}
                              />
                              {/*打赏*/}
                              <span>{item.post_metric.tip_count}</span>
                            </section>
                          </section>
                          <section
                            onTouchEnd={() => {
                              openMediaPreview(item)
                            }}
                            className="flex h-[220px] w-full items-center justify-center overflow-hidden rounded"
                          >
                            <MediaImagePreview attachment={item.post_attachment ?? []} />
                            {/* <LazyImageWithFileId containerAuto={true} fileId={item.post_attachment?.[0]?.file_id} alt={"post_attachment"} width={200} height={220} className="max-w-full max-h-full object-contain" /> */}
                          </section>
                        </section>
                        {/*// 0草稿状态 1发布 2审核中 3未通过*/}
                        {
                          [0, 1, 3].includes(item.post.post_status) ? (
                            <Link href={`/profile/manuscript/draft/edit?id=${item.post.id}`}
                              className="border-border-theme text-text-theme mt-2 flex w-full justify-center gap-2 rounded-[10px] border-2 py-2"
                            >
                              <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20}
                                className={"bg-background-theme"}
                              />
                              <span className={"text-[15px]"}>{t("itemActions.edit")}</span>
                            </Link>
                          )
                            : (
                              <button type={"button"}
                                className="border-border-theme text-text-theme mt-2 flex w-full justify-center gap-2 rounded-[10px] border-2 py-2 grayscale"
                              >
                                <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} className={"bg-background-theme"} />
                                <span className={"text-[15px]"}>{t("itemActions.edit")}</span>
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