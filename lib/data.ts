export async function fetchFeeds(
    currentPage: number,
){
    // console.log('process env', process.env)
    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/feeds?page=${currentPage}`, {
    // const res = await fetch(`http://localhost:3000/api/feeds?page=${currentPage}`, {
    const res = await fetch(`https://onlyfans-demo.vercel.app/api/feeds?page=${currentPage}`, {
        cache: "no-store", // Ensure fresh data on every request
    });
    const { items, hasMore } = await res.json();

    return { items, hasMore };
}