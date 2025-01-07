import { fetchFeeds } from "@/lib/data"
import Post from "@/components/post/post"
import { postData } from "@/components/post/mock"

export default async function Page() {
  const { items, hasMore }: { items: number[], hasMore: boolean } = await fetchFeeds(1)
  return (
    <>
      <div className="max-w-lg mx-auto grid grid-cols-1 gap-4 mt-4">
        {items.map((item, index) => (
          <Post key={index} data={postData} showSubscribe showVote />
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