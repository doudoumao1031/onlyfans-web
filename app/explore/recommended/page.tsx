"use client";
import {recomBlogger} from "@/lib/data";
import {ToggleGroupRecom, ToggleGroupRecomItem} from "@/components/ui/toggle-group-recommended";
import Card from "@/components/user/user-card";
import {BloggerInfo} from "@/lib/struct";
import {useState, useEffect} from "react";

/** 推荐博主 */
export default function Page() {
    const [type, setType] = useState<number>(0);
    const [info, setInfo] = useState<BloggerInfo[]>([]);
    useEffect(() => {
        const bloggerList = async () => {
            try {
                const bloggers = await recomBlogger({from_id: 0, page: 1, pageSize: 20, type: type});
                console.log("=====>type, 推荐博主",type, bloggers);
                setInfo(bloggers?.list||[]);
            } catch (error) {
                console.error("Error fetching recommended bloggers:", error);
            }
        };
        bloggerList();
    }, [type]);
    return (
        <>
            <ToggleGroupRecom type="single" variant="default" defaultValue="1" id="select_type"
                              className="w-full flex justify-between mb-[10px]"
                              onValueChange={(val)=>{
                                  setType(Number(val));
                              }}>
                <ToggleGroupRecomItem value="0">
                    <span className="text-nowrap font-medium text-base">热门推荐</span>
                </ToggleGroupRecomItem>
                <ToggleGroupRecomItem value="1">
                    <span className="text-nowrap font-medium text-base">新人推荐</span>
                </ToggleGroupRecomItem>
                <ToggleGroupRecomItem value="2">
                    <span className="text-nowrap font-medium text-base">🔥人气博主</span>
                </ToggleGroupRecomItem>
            </ToggleGroupRecom>
            {info.map((item) => (
                <div key={item.id} className="w-full mb-[10px]">
                    <Card user={item} subscribe={true}/>
                </div>
            ))}
        </>
    );
}