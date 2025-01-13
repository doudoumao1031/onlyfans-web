import React from "react"
import TimeSort from "@/components/profile/time-sort"
import FansListItem from "@/components/profile/fans/fans-list-item"
import { getFollowedUsers } from "@/lib"


export default async function Page() {
  const data = await getFollowedUsers({ page:1,pageSize: 10,from_id:0 })
  return (
    <div className={"px-4"}>
      <div className="flex justify-between py-4 items-center">
        <span>
          <span className={"text-[#777]"}>关注总数：</span>
          {data?.total}
        </span>
        <TimeSort sortDesc={false}>关注时间升序</TimeSort>
      </div>
      {data?.list.length && (
        data.list.map(item => <FansListItem data={item} key={item.user.id}/>)
      )}
      {!data?.list?.length && <div className={"text-center py-2 text-secondary"}>暂无数据</div>}
    </div>
  )
}