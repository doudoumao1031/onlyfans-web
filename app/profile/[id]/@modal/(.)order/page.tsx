// "use client";

import Link from "next/link";
// import { useRouter } from 'next/navigation';
import { SlideUpModal } from "@/components/common/slide-up-modal";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
// export default function Page({ params }: { params: { id: string } }) {
    // const router = useRouter();
    const { id } = await params;
    return (
        <SlideUpModal portalId="modal-root">
            <div className="h-[95vh] flex justify-center items-center text-black text-2xl">
                订阅管理 modal: {id}
                <Link href={`/profile/${id}/order/date`} >日期选择</Link>
                {/* <Link href={`/profile/${id}/order/(.)date`} >日期选择</Link> */}
                {/* <button onClick={() => router.push(`/profile/${id}/order/date`)}>
                    Open Date Modal
                </button> */}
            </div>
        </SlideUpModal>
    );
}