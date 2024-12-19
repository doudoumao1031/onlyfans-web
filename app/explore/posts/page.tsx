import InfiniteScroll from "@/components/explore/infinite-scroll-swr";
import {fetchFeeds} from "@/lib/data";

export const revalidate = 3600; // Regenerate the page every 3600 seconds

export default async function Page() {
    const { items, hasMore } = await fetchFeeds(1);
    return (
        <div className="container h-full w-full mx-auto">
            <InfiniteScroll initialItems={items} initialHasMore={hasMore} />
        </div>
    );
}
