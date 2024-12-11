export async function fetchSeeds(
    currentPage: number,
){
    const res = await fetch(`http://localhost:3000/api/seeds?page=${currentPage}`, {
        cache: "no-store", // Ensure fresh data on every request
    });
    const { items, hasMore } = await res.json();

    return { items, hasMore };
}