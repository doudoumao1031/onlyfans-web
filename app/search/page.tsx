import Image from "next/image";
import Search from "@/components/explore/search";
import {searchBlog} from "@/lib/data";
export default async function Page(
    props: {
        searchParams?: Promise<{
            query?: string;
        }>;
    }
) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    console.log("===>page search val :", query)
    // 搜索结果
    const result = "999";
    // const result = await searchBlog();
    return (
        /** 搜索 */
        <div className="w-full flex flex-col justify-center">
            <Search placeholder={"搜索"} />
            {
                query === "" && (
                    <span className="mt-16 text-gray-500 text-center">输入博主的昵称或用户名进行搜索</span>
                )
            }
            {
                result === "" && <div className="flex flex-col justify-center items-center justify-items-center mt-40">
                    <Image src="/icons/explore/icon_search_null@3x.png" alt="search is null"
                           width={200}
                           height={150}
                    />
                    <span className="mt-6 text-gray-500 text-center">没有搜到相关博主，请尝试别的搜索词</span>
                </div>
            }
        </div>
    );
}