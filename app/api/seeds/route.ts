export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
  
    const pageSize = 15;
    const newItems = Array.from({ length: pageSize }, (_, i) => i + (page - 1) * pageSize);
  
    // Simulating an endpoint limit
    const hasMore = page < 15;

    // Simulating latency
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
  
    return new Response(
        JSON.stringify({ items: newItems, hasMore }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}
  