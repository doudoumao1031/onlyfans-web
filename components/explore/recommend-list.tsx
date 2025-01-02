"use client"
import {BloggerInfo} from "@/lib/struct";
import {ToggleGroupRecom, ToggleGroupRecomItem} from "@/components/ui/toggle-group-recommended";
import Card from "@/components/user/user-card";

export default function RecommendList({data}:{data: BloggerInfo[]}){
    return (
        <>
            <ToggleGroupRecom type="single" variant="default" defaultValue="1" id="select_type"
                              className="w-full flex justify-between mb-[10px]"
                              onValueChange={()=>{}}>
                <ToggleGroupRecomItem value="1">
                    <span className="text-nowrap font-medium text-base">热门推荐</span>
                </ToggleGroupRecomItem>
                <ToggleGroupRecomItem value="2">
                    <span className="text-nowrap font-medium text-base">新人推荐</span>
                </ToggleGroupRecomItem>
                <ToggleGroupRecomItem value="3">
                    <span className="text-nowrap font-medium text-base">🔥人气博主</span>
                </ToggleGroupRecomItem>
            </ToggleGroupRecom>
            {data.map((info) => (
                <div key={info.id} className="w-full mb-[10px]">
                    <Card user={info} subscribe={true}/>
                </div>
            ))}
        </>
    )
}