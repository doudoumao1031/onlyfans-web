"use client"

import TabTitle, { iTabTitleOption } from "@/components/profile/tab-title"
import React, { Fragment, SyntheticEvent, useEffect, useMemo, useState } from "react"
import IconWithImage from "@/components/profile/icon"
import ManuscriptItem from "@/components/profile/manuscript/manuscript-item"
import Header from "@/components/common/header"
import Link from "next/link"
import { myMediaPosts, myPosts, PageResponse, PostData, SearchPostReq } from "@/lib"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import LazyImg from "@/components/common/lazy-img"
import { buildImageUrl } from "@/lib/utils"
import useCommonMessage, { CommonMessageContext } from "@/components/common/common-message"

enum ACTIVE_TYPE {
  POST = "POST",
  MEDIA = "MEDIA"
}

const ManuscriptPost = () => {
  const [timeSort, setTimeSort] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [initData, setInitData] = useState<PageResponse<PostData>>()

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
  useEffect(fetchInitData,[])

  const infiniteFetchMyPosts = useInfiniteFetch<SearchPostReq, PostData>({
    fetchFn: myPosts,
    params: {
      title,
      pageSize: 10,
      from_id: 0
    }
  })

  const handleFormSubmit = (event:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
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
            }} placeholder="输入博文内容" className="w-full bg-transparent flex pl-0.5"
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
            <span className="text-text-pink text-xs">创建时间</span>
          </button>
        </section>
      </form>
      <section className={"flex flex-col gap-2.5"}>
        {initData && (
          <InfiniteScroll<PostData> fetcherFn={infiniteFetchMyPosts} initialItems={initData.list} initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}>
            {({ items, isLoading, hasMore, error }) => (
              <Fragment>
                {Boolean(error) && <ListError />}
                {items?.map((item, index) => <ManuscriptItem data={item} key={index} refresh={fetchInitData}/>)}
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

const ManuscriptMedia = () => {
  const [timeSort, setTimeSort] = useState<boolean>(false)
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  useEffect(() => {
    myMediaPosts({
      page: 1,
      pageSize: 10,
      from_id: 0
    }).then(response => {
      console.log(response)
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
  return (
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
          <span className="text-text-pink text-xs">创建时间</span>
        </button>
      </div>
      <section className="">
        {initData && (
          <InfiniteScroll<PostData> className={"grid grid-cols-2 gap-3 mt-2"} fetcherFn={infiniteFetchMedia} initialItems={initData.list} initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}>
            {({ items, isLoading, hasMore, error }) => (
              <Fragment>
                {Boolean(error) && <ListError />}
                {items?.map((item, index) => (
                  <section key={index}>
                    <section className="rounded-xl relative overflow-hidden text-xs">
                      <section className="pl-2 pr-2 text-white absolute w-full left-0 flex justify-between top-0.5 z-10">
                        <section className="flex items-center gap-0.5">
                          <IconWithImage url={"/icons/profile/icon_fans_view_s@3x.png"} width={12} height={12}
                            color={"#fff"}
                          />
                          <span>989</span>
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
                          <span>{item.post_metric.collection_count}</span>
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
                        className="w-full h-[220px] rounded flex justify-center items-center overflow-hidden"
                      >
                        <LazyImg src={buildImageUrl(item.post_attachment?.[0]?.file_id)} alt={"post_attachment"} width={200} height={220} className="w-full h-full" />
                      </section>
                    </section>
                    <Link href={`/profile/manuscript/draft/edit?id=${item.post.id}`}
                      className="rounded-[10px] gap-2 flex justify-center pt-2 pb-2 border-border-pink border-2 text-text-pink w-full mt-2"
                    >
                      <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={"#FF8492"} />
                      <span>编辑</span>
                    </Link>
                  </section>
                ))}
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

export default function Page() {
  const [active, setActive] = useState<string>(ACTIVE_TYPE.POST)
  const tabOptions: iTabTitleOption[] = [
    { label: "帖子", name: ACTIVE_TYPE.POST },
    { label: "媒体", name: ACTIVE_TYPE.MEDIA }
  ]

  const { showMessage, renderNode } = useCommonMessage()

  return (
    <CommonMessageContext.Provider value={useMemo(() => ({ showMessage }), [showMessage])}>
      {renderNode}
      <div>
        <Header title="稿件管理" titleColor={"#000"} right={<Link href={"/profile/manuscript/draft"} className="text-text-pink text-base">草稿</Link>}>
        </Header>
        <TabTitle tabOptions={tabOptions} active={active} activeChange={setActive} />
        {active === ACTIVE_TYPE.POST && <ManuscriptPost />}
        {active === ACTIVE_TYPE.MEDIA && <ManuscriptMedia />}
      </div>

    </CommonMessageContext.Provider>
  )
}