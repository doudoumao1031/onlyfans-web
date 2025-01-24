"use client"
import Empty from "@/components/common/empty"
import FeedItem from "@/components/profile/dataCenter/feedItem"
import InputWithLabel from "@/components/profile/input-with-label"
import { PageResponse, PostData } from "@/lib"
import { getMyFeeds } from "@/lib/actions/space"
import { useEffect, useMemo, useState } from "react"


const filterTypes = [
  { label: "最新发布", value: 0 },
  { label: "总播放量", value: 1 },
  { label: "总评论", value: 2 },
  { label: "总点赞", value: 3 },
]
export default function Page() {
  const [posts, setPosts] = useState<PageResponse<PostData> | null>()
  const [type, setType] = useState<number>(0)

  useEffect(() => {
    getData()
  }, [type])
  const getData = async () => {
    const params = {
      page: 1,
      pageSize: 10,
      from_id: 0,
      sort_type: type
    }
    const res = await getMyFeeds(params)
    setPosts(res)
  }
  const title = useMemo(() => {
    const cur = filterTypes.find(v => v.value === type)
    return cur ? cur.label : '最新发布'
  }, [type])
  return (
    <div className="">
      <div className="flex justify-between mb-4 px-4">
        <div className="flex items-end">
          <h1 className="text-base font-medium">帖子列表</h1>
          <div className="ml-2 text-[#BBB] text-xs ">{`展示${title}的前20个帖子`}</div>
        </div>
        <InputWithLabel
          placeholder={"日期范围"}
          labelClass="border-0 pl-0 pr-0 pb-0 pt-[0px] text-[#6D7781]"
          iconSize={16}
          onInputChange={(e) => {
            setType(e as number)
          }}
          options={filterTypes}
          value={type}
        />
      </div>
      {posts && posts.list ? posts.list.map((v, i) => (
        <FeedItem key={i} item={v} />
      )) : <Empty />}
    </div>
  )
}