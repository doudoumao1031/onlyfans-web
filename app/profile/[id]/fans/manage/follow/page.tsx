import React from "react";
import TimeSort from "@/components/profile/time-sort";
import FansListItem from "@/components/profile/fans/fans-list-item";


export default async function Page() {
    return <div className={"px-4"}>
        <div className="flex justify-between py-4 items-center">
            <span>
                <span className={"text-[#777]"}>关注总数：</span>
                9999
            </span>
            <TimeSort sortDesc={false}>关注时间升序</TimeSort>
        </div>
        <FansListItem />
        <FansListItem />
        <FansListItem />
        <FansListItem />
    </div>
}