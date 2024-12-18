export default async function Page() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // throw new Error('Error loading team');

    return (
        <section className="h-96 w-96 border-2 rounded-lg p-4"  >
            <h2 className="text-xl">Team Settings</h2>
        </section>
    );
}