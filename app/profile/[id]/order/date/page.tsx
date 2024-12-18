export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="h-[95vh] flex justify-center items-center text-black text-2xl">
            订阅管理 date: {id}
        </div>
    );
}