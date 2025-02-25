import Image from "next/image"
import UserCard from "@/components/user/user-card"
import SearchInput from "@/components/explore/search-input"
import Post from "@/components/post/post"
import { searchPost, searchUser } from "@/lib"
import { getTranslations } from "next-intl/server"

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string
  }>
}) {
  const t = await getTranslations("Search")

  const searchParams = await props.searchParams
  const query = searchParams?.search || ""
  // 用户搜索
  let users
  if (query !== "") {
    users = await searchUser({ from_id: 0, page: 1, pageSize: 10, name: query })
    console.log("===> users", users)
  }

  // 帖子搜索
  let posts
  if (query !== "") {
    posts = await searchPost({ from_id: 0, page: 1, pageSize: 10, title: query })
    console.log("===> posts", posts)
  }
  return (
    /** 搜索 */
    <div className="w-full flex flex-col justify-center">
      <SearchInput placeholder={t("inputPlaceholder")} />
      {query === "" && (
        <span className="mt-16 text-gray-500 text-center">{t("description")}</span>
      )}
      {query !== "" && users && !users.list && users.total === 0 && posts && posts.total === 0 && (
        <div className="flex flex-col justify-center items-center justify-items-center mt-40">
          <Image
            src="/icons/explore/icon_search_null@3x.png"
            alt="search is null"
            width={200}
            height={150}
          />
          <span className="mt-6 text-gray-500 text-center">{t("noResult")}</span>
        </div>
      )}
      {query !== "" && users && users.total > 0 && users.list && (
        <div className="flex flex-col justify-start px-4 pt-[20px]">
          <span className="font-medium text-left text-[#6D7781]">{t("users")}</span>
          <div className="w-full mt-[10px]">
            {users.list.map((item, index) => (
              <div key={index} className="w-full mb-[10px]">
                <UserCard key={index} user={item} subscribe={true} />
              </div>
            ))}
          </div>
        </div>
      )}
      {query !== "" && users && users.total > 0 && posts && posts.total > 0 && (
        <hr className="border-t border-gray-200 w-full my-[20px]"></hr>
      )}
      {query !== "" && posts && posts.total > 0 && (
        <>
          <div className="flex flex-col justify-start px-4">
            <span className="font-medium text-left text-[#6D7781]">{t("posts")}</span>
          </div>
          <div className="w-full mt-[10px]">
            {posts.list.map((item, index) => (
              <div key={index} className="max-w-lg mx-auto grid grid-cols-1 gap-4 px-4">
                <Post data={item} hasSubscribe={false} hasVote={false} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
