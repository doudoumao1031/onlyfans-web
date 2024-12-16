import { SlideUpModal } from "@/components/common/slide-up-modal";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <SlideUpModal>
            <div className="h-[95vh] flex justify-center items-center text-black text-2xl">
                订阅管理 modal: {id}
            </div>
        </SlideUpModal>
    );
}