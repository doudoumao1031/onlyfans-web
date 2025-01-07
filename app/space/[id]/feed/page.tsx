import FeedList from "@/components/explore/feed-list";
import { ListEnd } from "@/components/explore/list-states";
import Post from "@/components/post/post";
import { fetchFeeds } from "@/lib/data";

export const revalidate = 3600; // Regenerate the page every 3600 seconds

export default async function Page() {
    const { items, hasMore } = await fetchFeeds(1);
    return (
        <div className="container h-full w-full mx-auto">
                   <FeedList initialItems={items} initialHasMore={hasMore} />
                   {/* <div className="max-w-lg mx-auto grid grid-cols-1 gap-4">
                {items.map((item, index) => (
                    <Post
                        key={`${item.id}-${index}`}
                        data={item}
                        showSubscribe
                        showVote
                    />
                ))}
            </div>
            {!hasMore && <ListEnd />} */}
        </div>
    );
}
