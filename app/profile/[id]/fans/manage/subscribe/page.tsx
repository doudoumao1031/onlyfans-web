import React from "react"
import TimeSort from "@/components/profile/time-sort"
import FansListItem from "@/components/profile/fans/fans-list-item"
import { getSubscribedUsers } from "@/lib"

export default async function Page() {
  const data = await getSubscribedUsers({ page: 1, pageSize: 10, from_id: 0 })
  return (
    <div className={"px-4"}>
      <div className="flex justify-between py-4 items-center">
        <span>
          <span className={"text-[#777]"}>订阅总数：</span>
          {data?.total ?? 0}
        </span>
        <TimeSort sortDesc={false}>最近订阅</TimeSort>
      </div>
      {data?.list.length && (
        data.list.map(item => <FansListItem isSubscribe data={item} key={item.user.id}/>)
      )}
      {!data?.list?.length && <div className={"text-center py-2 text-secondary"}>暂无数据</div>}
    </div>
  )
}