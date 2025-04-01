import { getTranslations } from "next-intl/server"

import Image from "next/image"


import SearchInput from "@/components/explore/search-input"
import Post from "@/components/post/post"
import UserCard from "@/components/user/user-card"
import { searchPost, searchUser } from "@/lib"


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
    <div className="flex w-full flex-col justify-center">
      <SearchInput placeholder={t("inputPlaceholder")} />
      {query === "" && (
        <span className="mt-16 text-center text-gray-500">{t("description")}</span>
      )}
      {query !== "" && users && !users.list && users.total === 0 && posts && posts.total === 0 && (
        <div className="mt-40 flex flex-col items-center justify-center">
          <Image
            src="/icons/explore/icon_search_null@3x.png"
            alt="search is null"
            width={200}
            height={150}
          />
          <span className="mt-6 text-center text-gray-500">{t("noResult")}</span>
        </div>
      )}
      {query !== "" && users && users.total > 0 && users.list && (
        <div className="flex flex-col justify-start px-4 pt-5">
          <span className="text-gray-secondary text-left font-medium">{t("users")}</span>
          <div className="mt-2.5 w-full overflow-x-auto">
            <div className="flex space-x-4">
              {users.list.map((item, index) => (
                <div key={index} className="min-w-[343px]">
                  <UserCard key={index} user={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {query !== "" && users && users.total > 0 && posts && posts.total > 0 && (
        <hr className="my-[20px] w-full border-t border-gray-200"></hr>
      )}
      {query !== "" && posts && posts.total > 0 && (
        <>
          <div className="flex flex-col justify-start px-4 pt-5">
            <span className="text-gray-secondary text-left font-medium">{t("posts")}</span>
          </div>
          <div className="mt-2.5 w-full">
            {posts.list.map((item, index) => (
              <div key={index} className="mx-auto grid max-w-lg grid-cols-1 gap-4 px-4">
                <Post data={item} hasSubscribe={false} hasVote={false} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
