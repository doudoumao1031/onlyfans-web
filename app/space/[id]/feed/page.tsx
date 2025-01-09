import { fetchFeeds } from "@/lib/data"
import { PostData } from "@/components/post/type"
import Post from "@/components/post/post"
import { getMockPostData } from "@/components/post/mock"

export default async function Page() {
  const { items, hasMore }: { items: PostData[], hasMore: boolean } = await fetchFeeds(1)
  return (
    <>
      <div className="max-w-lg mx-auto grid grid-cols-1 gap-4 mt-4">
        {items.map((item, index) => (
          <Post key={index} data={getMockPostData()} showSubscribe showVote />
        ))}
      </div>
      {!hasMore && (
        <div className="text-center mt-4">
          <p className="text-gray-500">You have reached the end.</p>
        </div>
      )}
    </>
  )
}