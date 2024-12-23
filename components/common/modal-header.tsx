import React from "react";

export default function ModalHeader({title, right, left}: {
    title: React.ReactNode,
    right?: React.ReactNode,
    left?: React.ReactNode,
}) {
    return <section className="flex align-middle justify-between items-center h-[44px] pl-4 pr-4 text-black">
        <div className="flex justify-start shrink-0 w-[30%]">{left}</div>
        <div className="text-center flex-1 text-[18px]">{title}</div>
        <div className="flex justify-end shrink-0 w-[30%] gap-5 items-center">{right}</div>
    </section>
}