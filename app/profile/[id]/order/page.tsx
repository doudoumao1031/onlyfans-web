export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="h-[95vh] flex justify-center items-center text-white text-2xl">
            订阅管理 modal: {id}
        </div>
    );
}