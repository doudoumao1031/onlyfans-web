export default async function Analytics() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    throw new Error('Error loading analytics');  

    return (
        <section className="h-96 w-96 border-2 rounded-lg p-4"  >
            <h2 className="text-xl">Analytics</h2>
        </section>
    );
}