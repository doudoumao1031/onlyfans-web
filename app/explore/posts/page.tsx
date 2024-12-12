import InfiniteScroll from "@/ui/explore/infinite-scroll-swr";
import {fetchSeeds} from "@/lib/data";

// You don’t need to change the implementation of fetchSeeds. 
export const revalidate = 3600; // Regenerate the page every 3600 seconds

export default async function Page() {
    const { items, hasMore } = await fetchSeeds(1);
    return (
        <div className="container h-full mx-auto p-4">
            <InfiniteScroll initialItems={items} initialHasMore={hasMore} />
        </div>
    );
}

// generateStaticParams is used to pre-generate pages for dynamic routes like /seed/[id].

// export const revalidate = 60;
// export const dynamicParams = true // or false, to 404 on unknown paths

// export async function generateStaticParams() {
//     const { items, hasMore } = await fetchSeeds(1);
//     return  { items, hasMore } 
// }

// export default async function Page({
//     params,
// }: {
//     params: Promise<{ items: number[], hasMore: boolean }>
// }) {
//     const items = (await params).items
//     const hasMore = (await params).hasMore
//     console.log('build Page', items, hasMore)
//     return (
//         <div className="container mx-auto p-4">
//             <InfiniteScroll initialItems={items} initialHasMore={hasMore} />
//         </div>
//     );
// }
