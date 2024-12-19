import { SlideUpModal } from "@/components/common/slide-up-modal";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <SlideUpModal>
            <div className="h-[35vh] flex justify-center items-center text-black text-2xl">
                打赏 tip modal: {id}
            </div>
        </SlideUpModal>
    );
}