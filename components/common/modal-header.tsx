import IconWithImage from "@/components/profile/icon";
import React from "react";

export default function ModalHeader({title, right, closeModal}: {
    title: React.ReactNode,
    right?: React.ReactNode,
    closeModal: () => void
}) {
    return <section className="flex align-middle justify-between items-center h-[44px] pl-4 pr-4 text-black">
        <div className="flex justify-start shrink-0 w-[30%]">
            <button onClick={closeModal}>
                <IconWithImage url="/icons/profile/icon-back.png" width={22} height={22} color={'#000'}/>
            </button>
        </div>
        <div className="text-center flex-1 text-[18px]">{title}</div>
        <div className="flex justify-end shrink-0 w-[30%] gap-5 items-center">{right}</div>
    </section>
}