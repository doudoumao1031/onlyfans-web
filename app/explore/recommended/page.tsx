import {recomBlogger} from "@/lib/data";
import RecommendList from "@/components/explore/recommend-list";

/** 推荐博主 */
export default async function Page() {
    const bloggers = await recomBlogger({ from_id: 0, page: 1, pageSize: 10 });
    console.log("=====>推荐博主",bloggers);
    return (
        <RecommendList data={bloggers?.list || []}></RecommendList>
    );
}