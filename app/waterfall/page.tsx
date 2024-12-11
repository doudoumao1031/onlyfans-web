// import React from "react";
// import InfiniteScroll from "@/app/ui/waterfall/infinite-scroll";
// interface PageProps {
//     initialItems: number[];
//     initialHasMore: boolean;
// }

// export default function Page({ initialItems, initialHasMore }: PageProps) {
//     return (
//         <div className="container mx-auto p-4">
//             <InfiniteScroll
//                 initialItems={initialItems}
//                 initialHasMore={initialHasMore}
//             />
//         </div>
//     );
// }

// export const revalidate = 60;

// export async function getStaticProps() {
//     const res = await fetch(`http://localhost:3000/api/seeds?page=1`);
//     const { items, hasMore } = await res.json();

//     return {
//         props: {
//             initialItems: items,
//             initialHasMore: hasMore,
//         },
//     };
// }

import InfiniteScroll from "@/app/ui/waterfall/infinite-scroll";

export const revalidate = 60;

async function fetchInitialData() {
    const res = await fetch(`http://localhost:3000/api/seeds?page=1`, {
        cache: "no-store", // Ensure fresh data on every request
    });
    const { items, hasMore } = await res.json();

    return { items, hasMore };
}

export default async function Page() {
    const { items, hasMore } = await fetchInitialData();

    return (
        <div className="container mx-auto p-4">
            <InfiniteScroll initialItems={items} initialHasMore={hasMore} />
        </div>
    );
}

