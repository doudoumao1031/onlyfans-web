import { SlideUpModal } from "@/components/common/slide-up-modal";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <SlideUpModal portalId="modal-inner">
            <div className="h-[35vh] flex justify-center items-center text-black text-2xl">
                日期选择 modal: {id}
            </div>
        </SlideUpModal>
    );
}