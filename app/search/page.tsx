import Image from "next/image";
import Search from "@/components/explore/search";
import UserCard from "@/components/user/user-card";
import { users} from "@/mock/user";

export default async function Page(
    props: {
        searchParams?: Promise<{
            search?: string;
        }>;
    }
) {
    const searchParams = await props.searchParams;
    const query = searchParams?.search || '';
    console.log(query)
    // 搜索结果
    const result = "1";
    // const interfactRes = searchPost(query).then((data)=>data.data);

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
                query !== "" && result === "" && <div className="flex flex-col justify-center items-center justify-items-center mt-40">
                    <Image src="/icons/explore/icon_search_null@3x.png" alt="search is null"
                           width={200}
                           height={150}
                    />
                    <span className="mt-6 text-gray-500 text-center">没有搜到相关博主，请尝试别的搜索词</span>
                </div>
            }
            {
                query !== "" && result !== "" && (
                    <>
                        <div className="flex flex-col justify-start px-4 pt-[20px]">
                            <span className="font-medium text-left text-[#6D7781]">用户</span>
                            <div className="w-full mt-[10px]">
                                <UserCard card={users[0]} subscribe={true}/>
                            </div>
                        </div>
                        <hr className="border-t border-gray-200 w-full my-[20px]"></hr>
                        <div className="flex flex-col justify-start px-4">
                            <span className="font-medium text-left text-[#6D7781]">博文</span>
                        </div>
                    </>
                )
            }
        </div>
    );
}