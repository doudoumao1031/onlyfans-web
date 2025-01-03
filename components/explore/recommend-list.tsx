"use client"
import {BloggerInfo} from "@/lib/struct";
import {ToggleGroupRecom, ToggleGroupRecomItem} from "@/components/ui/toggle-group-recommended";
import Card from "@/components/user/user-card";
import {useState} from "react";

export default function RecommendList({data}:{data: BloggerInfo[]}){
    const [info, setInfo] = useState<BloggerInfo[]>([]);
    return (
        <>
            <ToggleGroupRecom type="single" variant="default" defaultValue="1" id="select_type"
                              className="w-full flex justify-between mb-[10px]"
                              onValueChange={(val)=>{
                                  if (val === "1"){
                                      setInfo(data.slice(0, 2));
                                  } else if (val === "2"){
                                      setInfo(data.slice(0, 4))
                                  } else if (val === "3"){
                                      setInfo(data.slice(0, 5))
                                  }
                              }}>
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
            {info.map((item) => (
                <div key={item.id} className="w-full mb-[10px]">
                    <Card user={item} subscribe={true}/>
                </div>
            ))}
        </>
    )
}